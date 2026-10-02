import mongoose from 'mongoose';
import blog from '../models/blog.model.js';

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blog
            .find()
            .populate('userId', 'name rollnum')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            data: blogs,
            success: true,
            message: 'Blogs fetched successfully'
        });

    } catch (error) {
        console.error('Get blogs error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Failed to fetch blogs'
        });
    }
};

export const getBlog = async (req, res) => {
    try {
        const { id } = req.params;

        let foundBlog;

        if (mongoose.Types.ObjectId.isValid(id)) {
            foundBlog = await blog
                .findById(id)
                .populate('userId', 'name rollnum');
        }

        if (!foundBlog) {
            foundBlog = await blog
                .findOne({ slug: id })
                .populate('userId', 'name rollnum');
        }

        if (!foundBlog) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'Blog not found'
            });
        }

        return res.status(200).json({
            data: foundBlog,
            success: true,
            message: 'Blog fetched successfully'
        });

    } catch (error) {
        console.error('Get blog error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Failed to fetch blog'
        });
    }
};

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            desc,
            content,
            image,
            rating
        } = req.body;

        const authorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'Invalid user'
            });
        }

        const slug = generateSlug(title);

        const existingBlog = await blog.findOne({ slug });

        if (existingBlog) {
            return res.status(409).json({
                data: [],
                success: false,
                message: 'A blog with this title already exists'
            });
        }

        const newBlog = await blog.create({
            userId: authorId,
            title: title.trim(),
            slug,
            desc: desc.trim(),
            content: content.trim(),
            image: image.trim(),
            rating: Number(rating)
        });

        const populatedBlog = await blog
            .findById(newBlog._id)
            .populate('userId', 'name rollnum');

        return res.status(201).json({
            data: populatedBlog,
            success: true,
            message: 'Blog created successfully'
        });

    } catch (error) {
        console.error('Create blog error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Failed to create blog'
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'Invalid blog ID'
            });
        }

        const {
            title,
            desc,
            content,
            image,
            rating
        } = req.body;

        const existingBlog = await blog.findById(id);

        if (!existingBlog) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'Blog not found'
            });
        }

        const slug = generateSlug(title);

        const duplicateBlog = await blog.findOne({
            slug,
            _id: { $ne: id }
        });

        if (duplicateBlog) {
            return res.status(409).json({
                data: [],
                success: false,
                message: 'A blog with this title already exists'
            });
        }

        const updatedBlog = await blog.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                slug,
                desc: desc.trim(),
                content: content.trim(),
                image: image.trim(),
                rating: Number(rating)
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('userId', 'name rollnum');

        return res.status(200).json({
            data: updatedBlog,
            success: true,
            message: 'Blog updated successfully'
        });

    } catch (error) {
        console.error('Update blog error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Failed to update blog'
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'Invalid blog ID'
            });
        }

        const deletedBlog = await blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'Blog not found'
            });
        }

        return res.status(200).json({
            data: deletedBlog,
            success: true,
            message: 'Blog deleted successfully'
        });

    } catch (error) {
        console.error('Delete blog error:', error);

        return res.status(500).json({
            data: [],
            success: false,
            message: 'Failed to delete blog'
        });
    }
};