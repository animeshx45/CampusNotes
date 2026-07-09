const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

// Define the MaterialFile Schema
const MaterialFileSchema = new mongoose.Schema({
  fileName: String,
  contentType: String,
  data: String
}, { collection: 'materialfiles' });

const MaterialFile = mongoose.models.MaterialFile || mongoose.model('MaterialFile', MaterialFileSchema);

const fileIds = [
  '6a4fc23f649e54d4d361113d', // Kaagaz
  '6a4fc116649e54d4d3611136', // Network Theorems
  '6a4fb5b49a361eb4c9fd35e1', // BEE Pratical
  '6a4faedd98a68fb8365a08cf', // Superposition
  '6a4fae8a3e83af698d3a7236'  // Tutorials
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.\n");
    const db = mongoose.connection.db;

    // Check MaterialFile collection
    console.log("Checking MaterialFile collection:");
    for (const id of fileIds) {
      try {
        const file = await MaterialFile.findById(id);
        if (file) {
          console.log(`- ID: ${id}: FOUND in MaterialFile. Name: "${file.fileName}", Data length: ${file.data ? file.data.length : 0} bytes`);
        } else {
          console.log(`- ID: ${id}: NOT found in MaterialFile`);
        }
      } catch (e) {
        console.log(`- ID: ${id}: Error querying MaterialFile: ${e.message}`);
      }
    }

    // Check GridFS bucket files
    console.log("\nChecking GridFS (study_materials.files) collection:");
    const gridFilesColl = db.collection('study_materials.files');
    for (const id of fileIds) {
      try {
        const objId = new mongoose.Types.ObjectId(id);
        const file = await gridFilesColl.findOne({ _id: objId });
        if (file) {
          console.log(`- ID: ${id}: FOUND in GridFS. Name: "${file.filename}", Length: ${file.length} bytes, UploadDate: ${file.uploadDate}`);
        } else {
          console.log(`- ID: ${id}: NOT found in GridFS`);
        }
      } catch (e) {
        console.log(`- ID: ${id}: Error querying GridFS: ${e.message}`);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected.");
  }
}

run();
