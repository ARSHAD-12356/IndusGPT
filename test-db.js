const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://arshuarshad1551_db_user:6JkuroTNPdlY1W4o@ac-bomn3q2.uiextx3.mongodb.net/indusgpt?retryWrites=true&w=majority";

async function test() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}
test();
