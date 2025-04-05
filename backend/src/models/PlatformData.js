const mongoose = require("mongoose");

// Base schema for common fields across all platforms
const platformDataSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
};

// LeetCode specific data schema
const leetcodeSchema = new mongoose.Schema({
  ...platformDataSchema,
  username: {
    type: String,
    required: true,
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  easySolved: {
    type: Number,
    default: 0,
  },
  mediumSolved: {
    type: Number,
    default: 0,
  },
  hardSolved: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Number,
    default: 0,
  },
  maxRank: {
    type: Number,
    default: 0,
  },
  contributionPoints: {
    type: Number,
    default: 0,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  badges: {
    type: Number,
    default: 0,
  },
  contestsParticipated: {
    type: Number,
    default: 0,
  },
  contestHistory: [
    {
      contestName: String,
      date: Date,
      rating: Number,
      ranking: Number,
      problemsSolved: Number,
      totalProblems: Number,
    },
  ],
  submissionStats: {
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptedSubmissions: {
      type: Number,
      default: 0,
    },
  },
  recentSubmissions: [
    {
      problemId: String,
      problemName: String,
      problemUrl: String,
      difficulty: String,
      status: String,
      language: String,
      timestamp: Date,
    },
  ],
});

// CodeForces specific data schema
const codeforcesSchema = new mongoose.Schema({
  ...platformDataSchema,
  handle: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  maxRating: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "Unrated",
  },
  maxRank: {
    type: String,
    default: "Unrated",
  },
  contribution: {
    type: Number,
    default: 0,
  },
  contestCount: {
    type: Number,
    default: 0,
  },
  ratingHistory: [
    {
      contestId: Number,
      contestName: String,
      rank: Number,
      ratingChange: Number,
      newRating: Number,
      date: Date,
    },
  ],
  recentSubmissions: [
    {
      problemId: String,
      problemName: String,
      verdict: String,
      programmingLanguage: String,
      timestamp: Date,
    },
  ],
});

// CodeChef specific data schema
const codechefSchema = new mongoose.Schema({
  ...platformDataSchema,
  handle: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  stars: {
    type: Number,
    default: 0,
  },
  globalRank: {
    type: Number,
    default: 0,
  },
  countryRank: {
    type: Number,
    default: 0,
  },
  country: {
    type: String,
    default: "",
  },
  problemsSolved: {
    type: Number,
    default: 0,
  },
  contestAttended: {
    type: Number,
    default: 0,
  },
  ratingHistory: [
    {
      contestName: String,
      rating: Number,
      rank: Number,
      date: Date,
    },
  ],
});

const LeetCodeData = mongoose.model("LeetCodeData", leetcodeSchema);
const CodeForcesData = mongoose.model("CodeForcesData", codeforcesSchema);
const CodeChefData = mongoose.model("CodeChefData", codechefSchema);

module.exports = {
  LeetCodeData,
  CodeForcesData,
  CodeChefData,
};
