const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

const MaterialFileSchema = new mongoose.Schema({
  fileName: String,
  contentType: String,
  data: String
}, { collection: 'materialfiles', strict: false });

const MaterialFile = mongoose.models.MaterialFile || mongoose.model('MaterialFile', MaterialFileSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    const fileId = "6a4f914aa4efdc1b87adbe0d";
    const file = await MaterialFile.findById(fileId);
    if (!file) {
      console.log(`No MaterialFile found with ID: ${fileId}`);
      
      // Let's also check GridFS bucket files
      const conn = mongoose.connection;
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'study_materials',
        chunkSizeBytes: 2 * 1024 * 1024
      });
      try {
        const objectId = new mongoose.Types.ObjectId(fileId);
        const files = await bucket.find({ _id: objectId }).toArray();
        console.log(`GridFS files found:`, files);
      } catch (err) {
        console.log("Error querying GridFS:", err.message);
      }
    } else {
      console.log("Found MaterialFile:", {
        id: file._id,
        fileName: file.fileName,
        contentType: file.contentType,
        dataLength: file.data ? file.data.length : 0
      });
    }
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
