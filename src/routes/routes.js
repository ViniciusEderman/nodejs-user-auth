const express = require("express");
const { isLogin } = require("../middleware/auth");
const { Cache, CacheUserByID } = require("../middleware/redis");
const userController = require("../controllers/userController");
const router = express.Router();

//get routes
router.get("/home", isLogin, userController.home);
router.get("/list/users/:id", isLogin, CacheUserByID, userController.listUserByID)
router.get("/list/users", isLogin, Cache, userController.listUsers);

//post routes
router.post("/register", userController.register);
router.post("/login", userController.login);

//put routes
router.put("/update/user/:id", userController.updateUser);

//delete routes
router.delete("/:id", userController.deleteUser);

module.exports = router;
