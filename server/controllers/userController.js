const bcrypt = require('bcrypt');
const userModel = require("../models/userModel");
require('dotenv').config();  // Make sure to load environment variables

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid Password");
    }

    // If passwords match, return user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Register callback
const registerController = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // Hash the password before saving it
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;  // Retrieve salt rounds from .env file, default to 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = new userModel({ ...rest, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { loginController, registerController };
