const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ==================== REGISTER ====================
exports.register = async (req, res) => {
  const { name, familyName, username, email, phone, country, password } =
    req.body;

  try {
    if (
      !name ||
      !familyName ||
      !username ||
      !email ||
      !phone ||
      !country ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      familyName,
      username,
      email,
      phone,
      country,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      familyName: user.familyName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== LOGIN ====================
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      familyName: user.familyName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
