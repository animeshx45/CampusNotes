import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    let connectionUri = MONGODB_URI;
    const opts: any = {
      bufferCommands: false,
    };

    // Robust parsing for passwords with special characters (like '@') in mongodb connection string
    try {
      const match = MONGODB_URI!.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
      if (match) {
        const prefix = match[1];
        const rest = match[2];
        
        // Find the last '@' sign, which separates credentials from the hostname
        const lastAtIndex = rest.lastIndexOf('@');
        if (lastAtIndex !== -1) {
          const credentialsPart = rest.substring(0, lastAtIndex);
          const hostPart = rest.substring(lastAtIndex + 1);
          
          // Split username and password by the first ':'
          const colonIndex = credentialsPart.indexOf(':');
          if (colonIndex !== -1) {
            const username = credentialsPart.substring(0, colonIndex);
            // Decode password to support both raw and encoded characters
            const password = decodeURIComponent(credentialsPart.substring(colonIndex + 1));
            
            // Rebuild URI without credentials
            connectionUri = `${prefix}${hostPart}`;
            opts.user = username;
            opts.pass = password;
          }
        }
      }
    } catch (parseError) {
      console.warn('Failed to parse MONGODB_URI options, falling back to raw URI:', parseError);
    }

    cached.promise = mongoose.connect(connectionUri!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
