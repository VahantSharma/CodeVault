const PlatformDataService = require("../services/PlatformDataService");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all platform data for the current user
// @route   GET /api/platforms/data
// @access  Private
const getAllPlatformData = asyncHandler(async (req, res) => {
  const platformService = new PlatformDataService(req.user.id);
  const data = await platformService.getAllPlatformData();

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Get data for a specific platform
// @route   GET /api/platforms/data/:platform
// @access  Private
const getPlatformData = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const platformService = new PlatformDataService(req.user.id);
  const data = await platformService.getPlatformData(platform);

  if (!data) {
    return res.status(404).json({
      success: false,
      error: `No data found for ${platform}`,
    });
  }

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Connect a platform to the user's account
// @route   POST /api/platforms/connect/:platform
// @access  Private
const connectPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: "Please provide username",
    });
  }

  const platformService = new PlatformDataService(req.user.id);
  const result = await platformService.connectPlatform(platform, username);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Disconnect a platform from the user's account
// @route   POST /api/platforms/disconnect/:platform
// @access  Private
const disconnectPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.params;

  const platformService = new PlatformDataService(req.user.id);
  const result = await platformService.disconnectPlatform(platform);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Update platform data
// @route   POST /api/platforms/update/:platform
// @access  Private
const updatePlatformData = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const userId = req.user.id;

    if (!platform) {
      return res.status(400).json({
        success: false,
        error: "Please provide a platform",
      });
    }

    const platformService = new PlatformDataService(userId);

    // Check if the platform is connected first
    const connections = await platformService.getConnectedPlatforms();
    const platformKey = platform.toLowerCase();

    // Platform not connected or username is empty
    if (!connections[platformKey]) {
      return res.status(400).json({
        success: false,
        error: `${platform} is not connected. Please connect your account first.`,
      });
    }

    const result = await platformService.updatePlatformData(platform);

    // Handle error cases more gracefully
    if (result && result.success === false) {
      return res.status(500).json({
        success: false,
        error: `Error updating ${platform} data: ${
          result.error || "Unknown error"
        }`,
        details: result,
      });
    }

    // Get the updated data to return to the client
    const updatedData = await platformService.getPlatformData(platform);

    res.status(200).json({
      success: true,
      message: `${platform} data updated successfully`,
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update data for all connected platforms
// @route   POST /api/platforms/update-all
// @access  Private
const updateAllPlatforms = asyncHandler(async (req, res) => {
  const platformService = new PlatformDataService(req.user.id);
  const results = await platformService.updateAllPlatforms();

  res.status(200).json({
    success: true,
    data: results,
  });
});

// @desc    Get connected platforms
// @route   GET /api/platforms/connected
// @access  Private
const getConnectedPlatforms = asyncHandler(async (req, res) => {
  const platformService = new PlatformDataService(req.user.id);
  const connections = await platformService.getConnectedPlatforms();

  res.status(200).json({
    success: true,
    data: connections,
  });
});

// Test endpoint for LeetCode service
const testLeetCodeService = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required for testing LeetCode service",
    });
  }

  try {
    // Import the LeetCode service directly for testing
    const LeetCodeService = require("../services/LeetCodeService");

    // Create an instance with a dummy user ID
    const leetcodeService = new LeetCodeService(req.user.id);

    // Try all available methods to test connectivity
    const results = {
      timestamp: new Date(),
      username,
      directApiTest: null,
      scrapingTest: null,
      errors: [],
    };

    try {
      // Test direct API method by overriding the username method
      leetcodeService.getUsername = async () => username;
      console.log(`Testing direct API for username: ${username}`);
      const apiData = await leetcodeService.fetchUserData();
      results.directApiTest = {
        success: true,
        data: apiData,
      };
    } catch (error) {
      console.error(`Direct API test error: ${error.message}`);
      results.errors.push({
        method: "Direct API",
        message: error.message,
        stack: error.stack,
      });
      results.directApiTest = {
        success: false,
        error: error.message,
      };
    }

    try {
      // Test web scraping method
      console.log(`Testing web scraping for username: ${username}`);
      const scrapingData = await leetcodeService.fetchUserDataByScraping(
        username
      );
      results.scrapingTest = {
        success: true,
        data: scrapingData,
      };
    } catch (error) {
      console.error(`Web scraping test error: ${error.message}`);
      results.errors.push({
        method: "Web Scraping",
        message: error.message,
        stack: error.stack,
      });
      results.scrapingTest = {
        success: false,
        error: error.message,
      };
    }

    // Add user connection status
    try {
      const user = await require("../models/User").findById(req.user.id);
      results.userInfo = {
        hasLeetCodeUsername: !!user.leetcode_username,
        leetcodeUsername: user.leetcode_username || null,
      };
    } catch (error) {
      console.error(`Error getting user info: ${error.message}`);
    }

    return res.json({
      success: true,
      message: "LeetCode service test completed",
      results,
    });
  } catch (error) {
    console.error(`Main test error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error testing LeetCode service",
      error: error.message,
    });
  }
});

module.exports = {
  connectPlatform,
  disconnectPlatform,
  getPlatformData,
  getAllPlatformData,
  updatePlatformData,
  updateAllPlatforms,
  getConnectedPlatforms,
  testLeetCodeService,
};
