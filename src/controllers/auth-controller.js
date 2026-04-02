const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const signup = async (req, res, next) => {
    try {
        const {name, email, password, role} = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const lowercaseEmail = email.toLowerCase();

        const userExists = await User.findOne({email: lowercaseEmail});

        if(userExists){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, 
            email: lowercaseEmail,
            password: hashedPassword,
            role: role || "Viewer"
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.log("Error in signup controller -> ", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const lowercaseEmail = email.toLowerCase();

        const user = await User.findOne({email: lowercaseEmail});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
           {id: user._id, role: user.role},
           process.env.JWT_SECRET_KEY,
           {expiresIn: '7d'}  
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Error in login controller -> ", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
}

module.exports = {signup, login};
