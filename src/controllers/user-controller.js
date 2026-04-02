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
// updateUserRole
// changeActiveStatus


module.exports = {getUserProfile, getAllUsers}