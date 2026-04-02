const User = require('../models/User');

// getProfile
const getUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select('-password');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log("Error in getProfile -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
// getAllUsers

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
         console.log("Error in getAllUsers -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
// getUserById
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            userData: user
        });

    } catch (error) {
        console.log("Error in getUserById -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
// updateUserRole
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Please provide a role"
            });
        }

        const validRoles = ['Viewer', 'Analyst', 'Admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be Viewer, Analyst or Admin"
            });
        }

        if (req.params.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user
        });
    } catch (error) {
        console.log("Error in updateUserRole -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
// deactivateUser
const deactivateUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: user
        });
    } catch (error) {
        console.log("Error in deactivateUser -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
// activateUser
const activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user
        });
    } catch (error) {
        console.log("Error in activateUser -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = {getUserProfile, getAllUsers, getUserById, updateUserRole, deactivateUser, activateUser}