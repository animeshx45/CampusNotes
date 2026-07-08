import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

// Inline model definition to avoid Next.js import errors in separate execution
const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, default: 'General' },
  description: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  author: { type: String, required: true },
  uploaderId: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, default: 'approved' },
}, {
  timestamps: true
});

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);

async function main() {
  console.log("Connecting to Database...");
  
  let connectionUri = MONGODB_URI!;
  const opts: any = {
    bufferCommands: false,
  };

  try {
    const match = MONGODB_URI!.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (match) {
      const prefix = match[1];
      const rest = match[2];
      const lastAtIndex = rest.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const credentialsPart = rest.substring(0, lastAtIndex);
        const hostPart = rest.substring(lastAtIndex + 1);
        const colonIndex = credentialsPart.indexOf(':');
        if (colonIndex !== -1) {
          const username = credentialsPart.substring(0, colonIndex);
          const password = decodeURIComponent(credentialsPart.substring(colonIndex + 1));
          connectionUri = `${prefix}${hostPart}`;
          opts.user = username;
          opts.pass = password;
        }
      }
    }
  } catch (err) {
    console.warn("Failed to parse URI credentials, using raw URI:", err);
  }

  await mongoose.connect(connectionUri, opts);
  console.log("Connected to MongoDB!");

  const materials = [
    {
      title: "BEE Assignment Units 3 & 4 Figures",
      subject: "Basic Electrical Engineering",
      description: "Hand-drawn circuit diagrams and schematic figures for BEE Assignment Units 3 & 4.",
      branch: "Common to All",
      semester: 1,
      type: "Assignment",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      author: "Dr. Kushal M. Jagtap",
      uploaderId: "admin",
      downloadCount: 12,
      views: 34,
      status: "approved"
    },
    {
      title: "BEE Assignment (ECE Branch) - Units 3, 4 & 5",
      subject: "Basic Electrical Engineering",
      description: "Comprehensive BEE assignment covering AC circuits, resonance, power factor calculations, and polyphase systems.",
      branch: "Common to All",
      semester: 1,
      type: "Assignment",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      author: "Dr. Kushal M. Jagtap",
      uploaderId: "admin",
      downloadCount: 15,
      views: 45,
      status: "approved"
    },
    {
      title: "BEE Spring 2022 Midterm Examination Paper",
      subject: "Basic Electrical Engineering",
      description: "Official NIT Srinagar Spring 2022 midterm examination paper for Basic Electrical Engineering.",
      branch: "Common to All",
      semester: 1,
      type: "Previous Year Paper",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      author: "NIT Srinagar Electrical Engineering Department",
      uploaderId: "admin",
      downloadCount: 20,
      views: 58,
      status: "approved"
    }
  ];

  console.log("Inserting materials...");
  for (const m of materials) {
    const existing = await StudyMaterial.findOne({ title: m.title });
    if (existing) {
      console.log(`Skipped existing: ${m.title}`);
    } else {
      await StudyMaterial.create(m);
      console.log(`Inserted: ${m.title}`);
    }
  }

  console.log("Done!");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
