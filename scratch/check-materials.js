const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

mongoose.connect(MONGODB_URI).then(async () => {
  const materials = await mongoose.connection.db.collection('studymaterials').find({}).toArray();
  console.log("Database Materials Count:", materials.length);
  if (materials.length > 0) {
    console.log("Sample Material Details:");
    console.log(materials.slice(0, 5).map(m => ({ id: m._id.toString(), title: m.title, type: m.type, fileUrl: m.fileUrl })));
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
