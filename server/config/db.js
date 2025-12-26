const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {})
        console.log("MongoDb connected")
    } catch (e) {
        console.log("Error Connecting Mongodb : ", e)
        process.exit(1)
    }
}

module.exports = connectDB