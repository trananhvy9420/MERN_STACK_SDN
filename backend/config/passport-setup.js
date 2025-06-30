// config/passport-setup.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Member = require("../src/models/member"); // Đảm bảo đường dẫn đúng
const sendPasswordByEmail = require("../utils/sendEmail"); // Đảm bảo đường dẫn đúng
// Cấu hình serialize và deserialize user
// Passport sẽ lưu user.id vào session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Khi có request, Passport sẽ lấy id từ session và tìm user trong DB
passport.deserializeUser((id, done) => {
  Member.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.birthday.read",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);

      try {
        const existingMember = await Member.findOne({ googleId: profile.id });
        if (existingMember) {
          console.log("User already exists:", existingMember);
          // Nếu người dùng đã tồn tại, trả về thông tin của họ và hoàn tất
          return done(null, existingMember);
        }
        const randomPassword = crypto.randomBytes(8).toString("hex");
        // 2. Băm mật khẩu này
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        let yearOfBirth = null;
        if (
          profile._json &&
          profile._json.birthdays &&
          profile._json.birthdays.length > 0
        ) {
          yearOfBirth = profile._json.birthdays[0].date.year;
        }

        const newMember = new Member({
          googleId: profile.id,
          membername: profile.displayName,
          name: profile.displayName,
          email: profile.emails[0].value,
          YOB: yearOfBirth,
          password: hashedPassword,
        });

        await newMember.save();
        console.log("Created new user:", newMember);
        await sendPasswordByEmail(newMember.email, randomPassword);
        done(null, newMember);
      } catch (error) {
        console.error("Error in Google Strategy", error);
        done(error, null);
      }
    }
  )
);
