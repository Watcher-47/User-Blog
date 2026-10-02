import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required']
    },

    title: {
        type: String,
        required: [true, 'Title is required'],
    },

    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },

    desc: {
        type: String,
        required: [true, 'Description is required'],
    },

    content: {
        type: String,
        required: [true, 'Content is required'],
    },

    image: {
        type: String,
        required: [true, 'Image URL is required'],
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?(#.*)?$/i,
            'Please use a valid image URL'
        ]
    },

    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        default: 1
    }

}, {
    timestamps: true,
    collection: 'blogs'
});

const blog = mongoose.model('blog', blogSchema);

export default blog;