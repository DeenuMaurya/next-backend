const express = require("express");
const router = express.Router();

const {
    createDummyUsers
} = require("../controller/userController");

router.post("/generate", createDummyUsers);

module.exports = router;