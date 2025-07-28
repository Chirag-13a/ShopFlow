const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // Always delete existing user (for testing purposes)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Existing user found, deleting:", email);
        await User.findOneAndDelete({ email });
      } else {
        console.log("No existing user found for email:", email);
      }

      // Create a new user
      const user = new User({
        name: profile.displayName,
        email: email,
        picture: profile.photos[0].value
      });

      await user.save();
      console.log("New user saved to database:", email);

      // Send login email
      try {
        console.log("Sending Google login email to:", email);

        await sendEmail(
          email,
          "Google Login Detected",
          `Hi ${profile.displayName},\n\nYou just logged in using your Google account.\n\nIf this wasn't you, please secure your account.`
        );

        console.log("Login email sent to:", email);
      } catch (emailErr) {
        console.error("Failed to send Google login email:", emailErr.message);
      }

      return done(null, user);
    } catch (err) {
      console.error("Google strategy error:", err.message);
      return done(err, null);
    }
  }
));
