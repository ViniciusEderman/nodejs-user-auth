const express = require("express");
const { isLogin } = require("../middleware/auth");
const { Cache } = require("../middleware/redis");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/home", isLogin, userController.home);
router.get("/list/users", isLogin, Cache, userController.listUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update/user/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;