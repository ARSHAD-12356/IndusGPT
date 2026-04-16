const mongoose = require('mongoose');

const uri1 = "mongodb://arshuarshad1551_db_user:6JkuroTNPdlY1W4o@ac-bomn3q2-shard-00-00.uiextx3.mongodb.net:27017,ac-bomn3q2-shard-00-01.uiextx3.mongodb.net:27017,ac-bomn3q2-shard-00-02.uiextx3.mongodb.net:27017/indusgpt?ssl=true&replicaSet=atlas-bomn3q2-shard-0&authSource=admin&retryWrites=true&w=majority";

const uri2 = "mongodb+srv://arshuarshad1551_db_user:6JkuroTNPdlY1W4o@ac-bomn3q2.uiextx3.mongodb.net/indusgpt?retryWrites=true&w=majority"; // guess from replica set

async function run() {
    try {
        console.log("trying uri2...");
        await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000, family: 4 });
        console.log("uri2 connected!");
        process.exit(0);
    } catch(e) {
        console.error("uri2 failed", e.message);
    }
}
run();
