const userService = require("../services/userService");

const home = (req, res) => {
  res.json({
    mensagem: "Test home pag",
    idUser: req.userId,
  });
};

const listUsers = async (req, res) => {
  try {
    // simulando demora na resposta da rota
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const users = await userService.getAllUsers();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    
    await res.saveToCache(users);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error listing users" });
  }
};

const register = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(200).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = { home, listUsers, register, login, updateUser, deleteUser };
