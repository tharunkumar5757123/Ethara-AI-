const User = require("../models/User");

// =====================
// SEARCH USERS
// =====================
exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search || !search.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const regex = new RegExp(search.trim(), "i");

    const users = await User.find(
      { name: regex },
      "_id name email role"
    ).limit(10);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
