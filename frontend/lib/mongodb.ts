import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://arshuarshad1551_db_user:6JkuroTNPdlY1W4o@ac-bomn3q2.uiextx3.mongodb.net/indusgpt?retryWrites=true&w=majority";
let cached = (global as any).mongoose_v3;

if (!cached) {
    cached = (global as any).mongoose_v3 = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
