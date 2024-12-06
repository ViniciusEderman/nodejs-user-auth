const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const getAllUsers = async () => {
  return User.findAll({ attributes: ["id", "name", "email"] });
};

const createUser = async (data) => {
  if (!data.email || !data.password || !data.name) {
    throw new Error("Error registering user");
  }
  
  const userExists = await User.findOne({ where: { email: data.email } });
  if (userExists) throw new Error("Email already registered");

  data.password = await bcrypt.hash(data.password, 8);
  await User.create(data);
  return { message: "User registered" };
};

const loginUser = async (data) => {
  const user = await User.findOne({ where: { email: data.email } });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
  return { message: "Success", token };
};

const updateUser = async (id, data) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User not found");

  data.password = await bcrypt.hash(data.password, 8);
  await User.update(data, { where: { id } });
  return { message: "User updated successfully" };
};

const deleteUser = async (id) => {
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) throw new Error("User not found");
  return { message: "User deleted" };
};

module.exports = { getAllUsers, createUser, loginUser, updateUser, deleteUser };
