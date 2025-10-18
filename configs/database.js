const { default: mongoose } = require("mongoose")
const dotenv = require("./config.env")

const db = async()=>{
    try {
        await mongoose.connect(dotenv.MONGODB_URL);
        console.log("Database connected successfully.");
        
    } catch (error) {
        console.log(error.message);        
    }
}

module.exports = db;