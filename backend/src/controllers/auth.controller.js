const Member = require("../models/member")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signIn = async (req, res) => {
  const { membername, password } = req.body;
  if (!membername || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  try {
    const member = await Member.findOne({ membername });

    if (!member) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, member.password);

    if (match) {
      const payload = {
        id: member._id,
        isAdmin: member.isAdmin,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Login successful!",
        access_token: accessToken,
        refresh_token: refreshToken,
        member: {
          id: member._id,
          YOB: member.YOB,
          email: member.email,
          membername: member.membername,
          name: member.name,
          isAdmin: member.isAdmin,
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login Error: " + error);
    return res
      .status(500)
      .json({ message: "An error occurred on the server." });
  }
};
const signUp = async (req, res) => {
  const { membername, password, name, YOB, email } = req.body;
  try {
    const existingMember = await Member.findOne({ membername: membername });
    if (existingMember) {
      return res.status(400).json({ message: "Username is already existed" });
    }
    const existingEmail = await Member.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newMember = new Member({
      membername: membername,
      email: email,
      password: hashedPassword,
      name: name,
      YOB: YOB,
    });
    const savedMember = await newMember.save();
    return res.status(201).json({
      message: "Member registered successfully!",
      member: {
        id: savedMember._id,
        membername: savedMember.membername,
        email: savedMember.email,
        name: savedMember.name,
        YOB: savedMember.YOB,
      },
    });
  } catch (error) {
    console.error("Registration Error: " + error);
    console.error("Login Error: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration." });
  }
};

module.exports = {
  signIn,
  signUp,
};
