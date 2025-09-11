const asyncHandler = require('express-async-handler');

// Userio profilio redagavimas tik paciam useriui
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
  });
});

module.exports = {
  updateMyProfile,
};
