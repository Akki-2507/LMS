const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://akshitha:akki%402507@ac-pofzrzx-shard-00-00.qdvphke.mongodb.net:27017,ac-pofzrzx-shard-00-01.qdvphke.mongodb.net:27017,ac-pofzrzx-shard-00-02.qdvphke.mongodb.net:27017/lms_courses?ssl=true&replicaSet=atlas-n1le5w-shard-0&authSource=admin&appName=Courses",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
