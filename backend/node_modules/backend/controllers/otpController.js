const twilio = require('twilio');
const User = require('../models/userModel'); // Adjust the path according to your structure

// Initialize Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP to user's phone number
exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body; // Expecting phoneNumber in the request body
  const otp = generateOTP();

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    // Save OTP to the user
    await User.findOneAndUpdate({ phoneNumber }, { otp }, { new: true });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};

// Verify the OTP entered by the user
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    // Check if user exists and if the OTP matches
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    await User.findOneAndUpdate({ phoneNumber }, { otp: null });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error });
  }
};
