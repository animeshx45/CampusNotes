const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

const StudyMaterialSchema = new mongoose.Schema({
  title: String,
  subject: String,
  type: String,
  fileUrl: String,
  branch: String,
  semester: Number,
  author: String,
  createdAt: mongoose.Schema.Types.Mixed,
  folderFiles: mongoose.Schema.Types.Mixed
}, { collection: 'studymaterials', strict: false });

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    const id = "6a4f914ba4efdc1b87adbe0e";
    const material = await StudyMaterial.findById(id);
    if (!material) {
      console.log(`No material found with ID: ${id}`);
    } else {
      console.log("Found material:", JSON.stringify(material.toObject(), null, 2));
    }
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
