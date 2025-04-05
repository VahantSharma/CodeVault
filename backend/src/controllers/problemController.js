// Import the Submission model
const Submission = require("../models/Submission");

// Mock database for problems until we have a real database
const problems = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    // ... other fields from mockProblem
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]" },
      { input: "[3,2,4], 6", output: "[1,2]" },
      { input: "[3,3], 6", output: "[0,1]" },
    ],
    solutions: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
    },
  },
  // Add more problems as needed
];

// Helper function to execute code and check against test cases
const executeCode = (code, language, testCase) => {
  // In a real application, this would use a sandbox or code execution service
  // For this mock implementation, we'll compare against known solutions

  // This is a simplified simulation of code execution
  // In production, you'd want to use a secure sandbox to execute code
  try {
    // Simulate successful execution for most cases
    const passesAllTests = Math.random() > 0.2; // 80% chance to pass

    if (passesAllTests) {
      return {
        passed: true,
        message: "All test cases passed!",
        output: testCase.output,
      };
    } else {
      return {
        passed: false,
        message: `Test case failed. Expected ${testCase.output} but got something else.`,
        output: "Incorrect output",
      };
    }
  } catch (error) {
    return {
      passed: false,
      message: `Error: ${error.message}`,
      output: null,
    };
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Private
exports.getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find problem by ID
    const problem = problems.find((p) => p.id === parseInt(id));

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Don't send solutions to client
    const { solutions, ...problemData } = problem;

    res.status(200).json({
      success: true,
      data: problemData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Test solution against test cases
// @route   POST /api/problems/:id/test
// @access  Private
exports.testSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Please provide code and language",
      });
    }

    // Find problem by ID
    const problem = problems.find((p) => p.id === parseInt(id));

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Use the first test case for quick testing
    const result = executeCode(code, language, problem.testCases[0]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit solution
// @route   POST /api/problems/:id/submit
// @access  Private
exports.submitSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Please provide code and language",
      });
    }

    // Find problem by ID
    const problem = problems.find((p) => p.id === parseInt(id));

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Test against all test cases
    const results = problem.testCases.map((testCase) =>
      executeCode(code, language, testCase)
    );

    // Count passed test cases
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = problem.testCases.length;

    // Check if all test cases passed
    const allPassed = passedCount === totalCount;

    // Determine submission status
    const status = allPassed ? "Accepted" : "Wrong Answer";

    // Simulate execution time and memory usage
    const executionTime = Math.floor(Math.random() * 500) + 50; // Between 50-550ms
    const memory = Math.floor(Math.random() * 5000) + 1000; // Between 1000-6000 KB

    // Create a new submission record
    const submission = new Submission({
      user: userId,
      problem: parseInt(id),
      code,
      language,
      status,
      executionTime,
      memory,
      testCasesPassed: passedCount,
      totalTestCases: totalCount,
    });

    // Save the submission
    await submission.save();

    res.status(200).json({
      success: true,
      data: {
        submissionId: submission._id,
        passed: allPassed,
        testCasesPassed: passedCount,
        totalTestCases: totalCount,
        status,
        executionTime,
        memory,
        results,
        message: allPassed
          ? "Congratulations! Your solution passed all test cases."
          : `Your solution passed ${passedCount} out of ${totalCount} test cases.`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user submissions
// @route   GET /api/problems/submissions
// @access  Private
exports.getUserSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { problem } = req.query;

    let query = { user: userId };

    // If problem ID is provided, filter by problem
    if (problem) {
      query.problem = parseInt(problem);
    }

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};
