const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment.");
  process.exit(1);
}

// Define the StudyMaterial Schema
const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  author: { type: String, required: true },
  uploaderId: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, {
  timestamps: true
});

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);

const playlists = [
  // Common to All (1st Year)
  {
    title: "Matrices and Calculus (MAIR11)",
    description: "Detailed video lectures on matrices, differential and integral calculus, and sequences.",
    branch: "Common to All",
    semester: 1,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLU6SqdYcYsfJ27O0dvuMcePhOfYgLyA14",
    author: "Gajendra Purohit",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Engineering Chemistry (CHIR11)",
    description: "Detailed video lectures on molecular structure, chemical dynamics, spectroscopy, and organic chemistry foundations.",
    branch: "Common to All",
    semester: 1,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PL9es8fV5tE00d9z9Fom0P7WwRco5hPZ6i",
    author: "Ekeeda Engineering",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Basics of Electrical & Electronics Engineering (EEIR11)",
    description: "Fundamentals of DC circuits, AC circuits, transformers, electrical motors, and basic semiconductor devices.",
    branch: "Common to All",
    semester: 1,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLg49R-X49HjR6nN_2B2rS1VpD-V9rT8dK",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Complex Analysis & Differential Equations (MAIR21)",
    description: "Lectures on complex variables, analytic functions, contour integration, and ordinary/partial differential equations.",
    branch: "Common to All",
    semester: 2,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLU6SqdYcYsfIO3L_p-X10t42Z25n7nE85",
    author: "Gajendra Purohit",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Engineering Physics (PHIR11)",
    description: "Advanced video sessions on electromagnetism, quantum mechanics, wave optics, and solid-state physics.",
    branch: "Common to All",
    semester: 2,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLx2i3T4vD1S4S-8dFm-MhZ6o9i2B4iS7w",
    author: "Last Night Study",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Introduction to Computer Programming in C (CSIR12)",
    description: "Complete course on programming fundamentals, loops, arrays, pointers, structures, and file handling in C.",
    branch: "Common to All",
    semester: 2,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtXYZ",
    author: "Neso Academy",
    uploaderId: "system",
    status: "approved"
  },

  // Computer Science & Engineering (CSE)
  {
    title: "Data Structures and Algorithms (DSA)",
    description: "Excellent, detailed explanations of Linked Lists, Trees, Graphs, Sorting, Searching, and Dynamic Programming.",
    branch: "Computer Science & Engineering",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLg49R-X49HjR_V34K5q5vD-V9rT8dK",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Database Management Systems (DBMS)",
    description: "Lectures covering ER model, SQL queries, normalization, transactions, and indexing.",
    branch: "Computer Science & Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8Ku3_ZIyHXYT1k40f",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Operating Systems (OS)",
    description: "Comprehensive tutorials on CPU scheduling, process synchronization, deadlocks, memory management, and paging.",
    branch: "Computer Science & Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9dongp3DFaI11NH62tSq",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },

  // Information Technology (IT)
  {
    title: "Computer Networks (CN)",
    description: "Lectures on TCP/IP protocol stack, IP addressing, routing algorithms, subnets, and DNS.",
    branch: "Information Technology",
    semester: 5,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joF24pnyBGzXMnR",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Object Oriented Programming (OOPs)",
    description: "Core OOP concepts like inheritance, polymorphism, encapsulation, abstraction, and interfaces.",
    branch: "Information Technology",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLVlQHNRLflP8_DGKcMoGgJd274c1PUN11",
    author: "Apna College",
    uploaderId: "system",
    status: "approved"
  },

  // Electronics & Communication (ECE)
  {
    title: "Digital Electronics & Logic Design",
    description: "Logic gates, K-maps, multiplexers, decoders, flip-flops, registers, and counter circuits.",
    branch: "Electronics & Communication Engineering",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtXYZ",
    author: "Neso Academy",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Signals and Systems",
    description: "Fourier transform, Laplace transform, Z-transform, convolutions, and linear time-invariant (LTI) systems.",
    branch: "Electronics & Communication Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEaZg4_utpWi_uJ-985w8-o",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Analog Electronic Circuits",
    description: "BJT, MOSFET amplifiers, op-amps, feedback configurations, and oscillators.",
    branch: "Electronics & Communication Engineering",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLm_MSClsnwm-y_f7m1vU914vQ9P1V8WwY",
    author: "Neso Academy",
    uploaderId: "system",
    status: "approved"
  },

  // Electrical Engineering (EE)
  {
    title: "Control Systems Engineering",
    description: "Detailed video lectures on block diagrams, signal flow graphs, time response, Routh-Hurwitz, Root Locus, Nyquist, and Bode plots.",
    branch: "Electrical Engineering",
    semester: 5,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiF7bZ_tM_F5Fw25-bT1F_vP",
    author: "Gate Smashers",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Electrical Machines",
    description: "Lectures on DC machines, transformers, induction motors, and synchronous machines.",
    branch: "Electrical Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEXA_lH5_5X7C_X1s9A",
    author: "Ekeeda Engineering",
    uploaderId: "system",
    status: "approved"
  },

  // Mechanical Engineering (ME)
  {
    title: "Thermodynamics Lectures",
    description: "Concepts of work, heat, first & second laws of thermodynamics, entropy, and cycle efficiencies.",
    branch: "Mechanical Engineering",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLD8T1F9zO2F_t5M7d4_vP3vE1gS912c9M",
    author: "Unacademy GATE - ME",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Fluid Mechanics",
    description: "Fluid properties, pressure measurements, fluid statics, kinematics, Bernoulli's equation, and laminar/turbulent flows.",
    branch: "Mechanical Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLD8T1F9zO2F_9j6K5Z_wP3vE1gS912c9M",
    author: "Unacademy GATE - ME",
    uploaderId: "system",
    status: "approved"
  },

  // Civil Engineering (CE)
  {
    title: "Strength of Materials (SOM)",
    description: "Video sessions on stress, strain, bending moments, shear force diagrams, torsion, and deflection of beams.",
    branch: "Civil Engineering",
    semester: 3,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLD8T1F9zO2F-Bf6hL5X7C_X1s9B",
    author: "Gate Academy",
    uploaderId: "system",
    status: "approved"
  },
  {
    title: "Structural Analysis",
    description: "Determinacy, indeterminacy, energy methods, slope deflection, and moment distribution methods.",
    branch: "Civil Engineering",
    semester: 4,
    type: "YouTube Playlist",
    fileUrl: "https://www.youtube.com/playlist?list=PLD8T1F9zO2F-Bf6hL5X7C_X1s9C",
    author: "Gate Academy",
    uploaderId: "system",
    status: "approved"
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    
    // Setup connection options matching our db.ts helper logic
    let connectionUri = MONGODB_URI;
    const opts = { bufferCommands: false };

    const match = MONGODB_URI.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
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

    await mongoose.connect(connectionUri, opts);
    console.log("Successfully connected to MongoDB!");

    // Clear old YouTube Playlist materials to avoid duplicate seeding
    console.log("Clearing existing YouTube Playlists...");
    await StudyMaterial.deleteMany({ type: "YouTube Playlist" });

    // Seed new playlists
    console.log(`Inserting ${playlists.length} playlists...`);
    await StudyMaterial.insertMany(playlists);
    
    console.log("Database seeded successfully with branch playlists!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
