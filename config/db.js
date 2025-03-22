const mongoose = require('mongoose');
const uri = "mongodb+srv://neelpandya070:<neel@2206>@cluster0.ptxhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 