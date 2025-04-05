const User = require("../models/User");
const { generateToken } = require("../utils/jwtToken");
const PlatformDataService = require("../services/PlatformDataService");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      leetcode_username,
      codeforces_username,
      codechef_username,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create user with platform usernames if provided
    const userData = {
      name,
      email,
      password,
    };

    // Add platform usernames if provided - preserving them exactly as entered
    // Only check for empty strings but don't modify the usernames
    if (leetcode_username !== undefined)
      userData.leetcode_username = leetcode_username;
    if (codeforces_username !== undefined)
      userData.codeforces_username = codeforces_username;
    if (codechef_username !== undefined)
      userData.codechef_username = codechef_username;

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Update platform data if usernames have been provided
    if (leetcode_username || codeforces_username || codechef_username) {
      const platformService = new PlatformDataService(user._id);
      const updatePromises = [];

      if (leetcode_username && leetcode_username !== "") {
        updatePromises.push(platformService.updatePlatformData("leetcode"));
      }

      if (codeforces_username && codeforces_username !== "") {
        updatePromises.push(platformService.updatePlatformData("codeforces"));
      }

      if (codechef_username && codechef_username !== "") {
        updatePromises.push(platformService.updatePlatformData("codechef"));
      }

      // Run platform updates in the background
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).catch((error) => {
          console.error("Error updating platform data:", error);
        });
      }
    }

    // Don't send password
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Don't send password
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get platform connections
    const platformService = new PlatformDataService(req.user.id);
    const platformConnections = await platformService.getConnectedPlatforms();

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        platforms: platformConnections,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      leetcode_username,
      codeforces_username,
      codechef_username,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update fields if provided - preserve platform usernames exactly as entered
    if (name) user.name = name;
    if (email) user.email = email;
    if (leetcode_username !== undefined)
      user.leetcode_username = leetcode_username;
    if (codeforces_username !== undefined)
      user.codeforces_username = codeforces_username;
    if (codechef_username !== undefined)
      user.codechef_username = codechef_username;

    await user.save();

    // Update platform data if usernames have been provided
    const platformService = new PlatformDataService(req.user.id);
    const updatePromises = [];

    if (leetcode_username && leetcode_username !== "") {
      updatePromises.push(platformService.updatePlatformData("leetcode"));
    }

    if (codeforces_username && codeforces_username !== "") {
      updatePromises.push(platformService.updatePlatformData("codeforces"));
    }

    if (codechef_username && codechef_username !== "") {
      updatePromises.push(platformService.updatePlatformData("codechef"));
    }

    // Run platform updates in the background
    if (updatePromises.length > 0) {
      Promise.all(updatePromises).catch((error) => {
        console.error("Error updating platform data:", error);
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
