const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

// Define the StudyMaterial Schema simply
const StudyMaterialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String
}, { collection: 'studymaterials' });

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    // Delete records starting with /uploads/
    const result1 = await StudyMaterial.deleteMany({ fileUrl: /^\/uploads\// });
    console.log(`Deleted ${result1.deletedCount} materials pointing to "/uploads/"`);

    // Delete records pointing to local uploads by filename instead of ObjectId
    const result2 = await StudyMaterial.deleteMany({ fileUrl: /^\/api\/upload\?id=[0-9]+-/ });
    console.log(`Deleted ${result2.deletedCount} materials pointing to local filename IDs`);

  } catch (err) {
    console.error("Error running cleanup:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
