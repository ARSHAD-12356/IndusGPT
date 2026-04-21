import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    phone: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },
    themeColor: {
        type: String,
        default: '#4f46e5', // Default Indigo
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
