const express = require("express");
const router = express.Router();
const University = require("../Models/uni.model");

router.get("/", async (req, res, next) => {
  try {
    const result = await University.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

// Add a new topic
router.post("/", async (req, res, next) => {
  try {
    const university = new University(req.body);
    const result = await university.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
