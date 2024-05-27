const express = require("express");
const authController = require("../Controllers/authController");
const router = express.Router();
const User = require("../Models/User.model");
const jwt = require("jsonwebtoken");

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

// Define a route to fetch all data for the logged-in user
router.get("/userdata", async (req, res) => {
  try {
    // Check if the JWT token exists in the request cookies
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("JWT token not found in the cookie");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, "secret");

    // Extract the user ID from the decoded token
    const userId = decodedToken.id;

    // Retrieve the user's data from the database using the user ID
    const userData = await User.findById(userId);

    // Check if the user data exists
    if (!userData) {
      throw new Error("User data not found");
    }

    // Send the user's data as a response
    res.status(200).json(userData);
  } catch (err) {
    // Handle errors
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Define a route to render edit profile page
router.get("/editProfile", async (req, res) => {
  try {
    // Check if the JWT token exists in the request cookies
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("JWT token not found in the cookie");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, "secret");

    // Extract the user ID from the decoded token
    const userId = decodedToken.id;

    // Retrieve the user's data from the database using the user ID
    const userData = await User.findById(userId);

    // Check if the user data exists
    if (!userData) {
      throw new Error("User data not found");
    }

    // Render the editProfilePage.ejs view and pass user data
    res.render("editProfilePage", { user: userData });
  } catch (err) {
    // Handle errors
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Define a route to update user profile
router.post("/updateProfile", async (req, res) => {
  try {
    // Check if the JWT token exists in the request cookies
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("JWT token not found in the cookie");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, "secret");

    // Extract the user ID from the decoded token
    const userId = decodedToken.id;

    // Update user data in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: req.body.fullName,
        email: req.body.email,
      },
      { new: true }
    );

    // Check if the user data exists
    if (!updatedUser) {
      throw new Error("User data not found");
    }

    // Send the updated user data as a response
    res.status(200).json(updatedUser);
  } catch (err) {
    // Handle errors
    console.error("Error updating user data:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

// Define a route to render the admin edit user page
router.get("/adminEditUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("adminEditUserPage", { user });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).send("Server Error");
  }
});

// Define the addRow route *Application Table
router.post("/adminEditUserApplicationTable/:id/addRow", async (req, res) => {
  try {
    const userId = req.params.id;
    const newRow = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.myApplicationsTable.push(newRow);
    await user.save();

    res.status(200).send("Row added successfully");
  } catch (error) {
    console.error("Error adding row:", error.message);
    res.status(500).send("Server Error");
  }
});

// Define the deleteRow route
router.delete(
  "/adminEditUserApplicationTable/:id/deleteRow",
  async (req, res) => {
    try {
      const userId = req.params.id;
      const rowIndex = req.body.rowIndex;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.myApplicationsTable.splice(rowIndex, 1); // Remove the row at the specified index
      await user.save();

      res.status(200).send("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Define the updateRow route
router.put("/adminEditUserApplicationTable/:id/updateRow", async (req, res) => {
  try {
    const userId = req.params.id;
    const { rowIndex, updatedData } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the specific row in myApplicationsTable
    user.myApplicationsTable[rowIndex] = updatedData;
    await user.save();

    res.status(200).send("Row updated successfully");
  } catch (error) {
    console.error("Error updating row:", error.message);
    res.status(500).send("Server Error");
  }
});

// Define the addRow route *Progress Table
router.post("/adminEditUserProgressTable/:id/addRow", async (req, res) => {
  try {
    const userId = req.params.id;
    const newRow = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.progressTable.push(newRow);
    await user.save();

    res.status(200).send("Row added successfully");
  } catch (error) {
    console.error("Error adding row:", error.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/adminEditUserProgressTable/:id/deleteRow", async (req, res) => {
  try {
    const userId = req.params.id;
    const rowIndex = req.body.rowIndex;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.progressTable.splice(rowIndex, 1); // Remove the row at the specified index
    await user.save();

    res.status(200).send("Row deleted successfully");
  } catch (error) {
    console.error("Error deleting row:", error.message);
    res.status(500).send("Server Error");
  }
});

// Define the updateRow route
router.put("/adminEditUserProgressTable/:id/updateRow", async (req, res) => {
  try {
    const userId = req.params.id;
    const { rowIndex, updatedData } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the specific row in myApplicationsTable
    user.progressTable[rowIndex] = updatedData;
    await user.save();

    res.status(200).send("Row updated successfully");
  } catch (error) {
    console.error("Error updating row:", error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
