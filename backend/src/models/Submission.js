const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: Number, // Problem ID
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java", "cpp"],
    },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
      ],
      required: true,
    },
    executionTime: {
      type: Number, // in milliseconds
      default: 0,
    },
    memory: {
      type: Number, // in KB
      default: 0,
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
