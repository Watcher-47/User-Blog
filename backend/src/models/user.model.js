import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },

    rollnum: {
        type: Number,
        required: [true, 'Roll number is required'],
        unique: [true, 'Roll number must be unique'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

}, {
    timestamps: true,
    collection: 'users'
});

const user = mongoose.model('user', userSchema);

export default user;