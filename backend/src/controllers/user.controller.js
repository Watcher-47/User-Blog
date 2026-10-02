import user from '../models/user.model.js';

const getUser = async (req, res) => {
    try {
        const id = req.params.id;

        const userById = await user.findById(id);

        if (!userById) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'user not found!'
            });
        }

        return res.status(200).json({
            data: userById,
            success: true,
            message: 'user fetched successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: [],
            success: false,
            message: error.message
        });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();

        if (users.length === 0) {
            return res.status(200).json({
                data: [],
                success: true,
                message: 'no users found!'
            });
        }

        return res.status(200).json({
            data: users,
            success: true,
            message: 'users fetched successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: [],
            success: false,
            message: error.message
        });
    }
};


const createUser = async (req, res) => {
    try {
        const { rollnum, name, role } = req.body;

        if (!name || !rollnum) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'name and roll number are required!'
            });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'role must be either user or admin!'
            });
        }

        const newUser = {
            rollnum: Number(rollnum),
            name,
            role: role || 'user'
        };

        const createdUser = await user.create(newUser);

        return res.status(201).json({
            data: createdUser,
            success: true,
            message: 'user created successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: [],
            success: false,
            message: error.message
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, rollnum, role } = req.body;

        if (!name || !rollnum || !id) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'name, roll number, and id are required!'
            });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'role must be either user or admin!'
            });
        }

        const newUser = {
            name,
            rollnum: Number(rollnum),
            role: role || 'user'
        };

        const updatedUser = await user.findByIdAndUpdate(
            id,
            newUser,
            {
                returnDocument: 'after',
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'user not found!'
            });
        }

        return res.status(200).json({
            data: updatedUser,
            success: true,
            message: 'user updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: [],
            success: false,
            message: error.message
        });
    }
};


const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                data: [],
                success: false,
                message: 'id is required!'
            });
        }

        const deletedUser = await user.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                data: [],
                success: false,
                message: 'user not found!'
            });
        }

        return res.status(200).json({
            data: deletedUser,
            success: true,
            message: 'user deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: [],
            success: false,
            message: error.message
        });
    }
};


export {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};