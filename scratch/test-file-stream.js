const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://animeshx45:Ranjanx%40123@ac-v5vvhfl-shard-00-00.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-01.pn05852.mongodb.net:27017,ac-v5vvhfl-shard-00-02.pn05852.mongodb.net:27017/?ssl=true&replicaSet=atlas-ap4bwo-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

const fileId = '6a4fc116649e54d4d3611136'; // NETWORK_THEOREMS.pdf

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
    const conn = mongoose.connection;
    const db = conn.db;

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'study_materials',
      chunkSizeBytes: 2 * 1024 * 1024
    });

    const objectId = new mongoose.Types.ObjectId(fileId);

    console.log(`Starting download stream for ${fileId}...`);
    const downloadStream = bucket.openDownloadStream(objectId);

    const chunks = [];
    await new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
        console.log(`Received chunk of size ${chunk.length} bytes`);
      });
      downloadStream.on('end', () => {
        console.log("Stream ended successfully.");
        resolve();
      });
      downloadStream.on('error', (err) => {
        console.error("Stream error occurred:", err);
        reject(err);
      });
    });

    const fileBuffer = Buffer.concat(chunks);
    console.log(`Successfully concatenated file buffer. Total size: ${fileBuffer.length} bytes.`);

  } catch (err) {
    console.error("Error in process:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
