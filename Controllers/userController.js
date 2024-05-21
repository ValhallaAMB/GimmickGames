const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const Score = require("../models/Score");
const nodemailer = require("nodemailer");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const name = user.name;
    const email = user.email;

    // Find all score documents with the userId and populate the game field
    const userScores = await Score.find({ user: userId }).populate(
      "game",
      "name"
    );

    res.render("profile", { userScores, name, email });
  } catch (err) {
    console.error(err); // Log the error message
    return res.status(500).send(err.message);
  }
};

//  POST Functions
const registerUser = (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;
  const lowerName = name.toLowerCase();
  const lowerEmail = email.toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let errors = [];

  //  Check required fields
  if (!name || !email || !password || !passwordConfirmation) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //  Check if password length is greater than 5
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  //  Check if passwords match
  if (password !== passwordConfirmation) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (errors.length > 0) {
    res.render("index", {
      errors,
      name,
      email,
      password,
      passwordConfirmation,
      showModal: "registerModal", // Flag to indicate which modal to show
    });
  } else {
    //  Validation passed
    User.findOne({ email: lowerEmail }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already registered" });
        // User already exists in DB
        res.render("index", {
          errors,
          name,
          email,
          password,
          passwordConfirmation,
          showModal: "registerModal", // Flag to indicate which modal to show
        });
      } else if (lowerEmail == "" || !emailRegex.test(lowerEmail)) {
        errors.push({ msg: "Invalid email" });
        
        res.render("profile", {
          errors,
          name,
          email,
          password,
          confirmPassword,
          showModal: "registerModal",
        });
      } else {
        //  Check if Username already exists
        User.findOne({ name: lowerName }).then((user) => {
          if (user) {
            errors.push({ msg: "Username already exists" });
            res.render("index", {
              errors,
              name,
              email,
              password,
              passwordConfirmation,
              showModal: "registerModal", // Flag to indicate which modal to show
            });
          } else {
            const newUser = new User({
              name: lowerName,
              email: lowerEmail,
              password,
            });
            //  Hash Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                // Set user password to the new hashed password
                newUser.password = hash;

                // Save User
                newUser
                  .save()
                  .then((user) => {
                    req.flash("success_msg", "Registration Successful!");
                    res.render("index", { showModal: "loginModal" });
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        });
      }
    });
  }
};

//  User login
const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("index", {
        danger_msg: info.message,
        showModal: "loginModal",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/index");
    });
  })(req, res, next);
};

//  User logout
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  });
};

//  Delete current user
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the current user's session

    // Find the user by ID
    const user = await User.findById(userId);

    // Delete associated scores
    await Score.deleteMany({ user: userId });

    // Delete the user
    await user.deleteOne(user.userId);

    req.flash("success_msg", "User deleted successfully");
    res.redirect("/");
  } catch (err) {
    req.flash("error_msg", "Error deleting user");
    res.render("/profile");
  }
};

//  Update current user
const updateUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const lowerName = name.toLowerCase();
  const lowerEmail = email.toLowerCase();
  const userId = req.user.id;
  let userScores = [];

  try {
    userScores = await Score.find({ user: userId }).populate("game", "name");

    // Find the user by ID
    const user = await User.findById(req.user.id);
    const originalName = user.name;
    const originalEmail = user.email;

    // Check if Username already exists
    const existingUser = await User.findOne({ name: lowerName });
    if (existingUser && lowerName != originalName) {
      return res.render("profile", {
        danger_msg: "Username already exists",
        name: originalName,
        email: originalEmail,
        password,
        confirmPassword,
        userScores,
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: lowerEmail });
    if (existingEmail && lowerEmail != originalEmail) {
      return res.render("profile", {
        danger_msg: "Email already exists",
        name: originalName,
        email: originalEmail,
        password,
        confirmPassword,
        userScores,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (lowerEmail == "" || !emailRegex.test(lowerEmail)) {
      return res.render("profile", {
        danger_msg: "Invalid email",
        name: originalName,
        email: originalEmail,
        password,
        confirmPassword,
        userScores,
      });
    }

    // If password is provided, update it
    if (password != "" || confirmPassword != "") {
      if (password.length < 6) {
        return res.render("profile", {
          danger_msg: "Password must be at least 6 characters long",
          name: originalName,
          email: originalEmail,
          password,
          confirmPassword,
          userScores,
        });
      } else if (password != confirmPassword) {
        return res.render("profile", {
          danger_msg: "Passwords do not match",
          name: originalName,
          email: originalEmail,
          password,
          confirmPassword,
          userScores,
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    }

    // Update user information
    user.name = lowerName;
    user.email = lowerEmail;

    // Save the updated user
    await user.save();

    return res.render("profile", {
      success_msg: "Profile updated successfully",
      name: lowerName,
      email: lowerEmail,
      password,
      confirmPassword,
      userScores,
    });
  } catch (err) {
    return res.render("profile", {
      danger_msg: "Failed to update profile",
      name,
      email,
      password,
      confirmPassword,
      userScores,
    });
  }
};

// Forgot Password - Send OTP to Email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      // req.flash("error_msg", "Email not found");
      return res.render("index", {
        error_msg: "Email not found",
        showModal: "forgotPasswordModal",
      });
    }

    // Generate a random OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Replace user's password with OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp.toString(), salt);
    user.password = hashedOTP;
    await user.save();

    //  Send Email with OTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.OUTLOOK_EMAIL, // Your Outlook email address
        pass: process.env.OUTLOOK_PASS, // Your Outlook email password
      },
    });

    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: email,
      subject: "Gimmick Games Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.render(`index`, {
      email,
      success_msg: "OTP sent",
      showModal: "resetPasswordModal",
    });
  } catch (error) {
    console.error(error);
    // req.flash("error_msg", "Error resetting password");
    res.render("index", {
      danger_msg: "Error resetting password",
      showModal: "forgotPasswordModal",
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Compare the OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, user.password);

    if (isMatch) {
      // If OTP matches, redirect to change password page
      return res.render("index", {
        email,
        success_msg: "OTP confirmed! Change your password.",
        showModal: "changePasswordModal",
      }); // Redirect to change password page
    } else {
      // If OTP does not match, show error message and reload resetPassword page
      return res.render("index", {
        email,
        danger_msg: "OTP is incorrect",
        showModal: "resetPasswordModal",
      });
    }
  } catch (error) {
    console.error(error);
    // req.flash("error_msg", "Error resetting password");
    res.render("index", {
      danger_msg: "Error resetting password",
      showModal: "forgotPasswordModal",
    });
  }
};

const changePassword = async (req, res) => {
  const { password, confirmPassword, email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.render("index", {
        email,
        error_msg: "Passwords do not match",
        showModal: "changePasswordModal",
      });
    }

    // Check if password length is at least 6 characters
    if (password.length < 6) {
      return res.render("index", {
        email,
        error_msg: "Password must be at least 6 characters long",
        showModal: "changePasswordModal",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();

    // Redirect to login page with success message
    return res.render("index", {
      // email,
      success_msg: "Password changed successfully",
      showModal: "loginModal",
    });
  } catch (error) {
    console.error(error);
    return res.render("index", {
      email,
      danger_msg: "Something went wrong, please try again",
      showModal: "changePasswordModal",
    });
  }
};

module.exports = {
  getUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
