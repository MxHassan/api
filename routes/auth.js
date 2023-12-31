const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
    
// register users
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // securing password
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, salt);
    // register user
    const newUser = await new User({
      username: username,
      email: email,
      password: hashedPassword,
      // salt: salt,
    });
    // saving user and sending response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
