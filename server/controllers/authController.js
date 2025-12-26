const User = require("../models/User.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

// ================= REGISTER =================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// ================= LOGIN =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// ================= PROFILE =================
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { registerUser, loginUser, getUserProfile }
