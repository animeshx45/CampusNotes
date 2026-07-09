const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

// Define the StudyMaterial Schema simply
const StudyMaterialSchema = new mongoose.Schema({
  title: String,
  subject: String,
  type: String,
  fileUrl: String,
  folderFiles: [{
    name: String,
    fileUrl: String,
    type: { type: String }
  }]
}, { collection: 'studymaterials' });

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully.\n");

    const materials = await StudyMaterial.find().sort({ _id: -1 }).limit(10);
    console.log(`Found ${materials.length} recent materials in DB:`);
    materials.forEach((m, idx) => {
      console.log(`${idx + 1}. Title: "${m.title}"`);
      console.log(`   ID: ${m._id}`);
      console.log(`   Type: ${m.type}`);
      console.log(`   File URL: "${m.fileUrl}"`);
      if (m.folderFiles && m.folderFiles.length > 0) {
        console.log(`   Folder files (${m.folderFiles.length}):`);
        m.folderFiles.forEach(f => {
          console.log(`     - Name: "${f.name}", URL: "${f.fileUrl}"`);
        });
      }
      console.log("-----------------------------------------");
    });

  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
