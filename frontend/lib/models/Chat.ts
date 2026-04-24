import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    image: { type: String },
    images: [{ type: String }],
}, { _id: false });

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 120,
    },
    messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
