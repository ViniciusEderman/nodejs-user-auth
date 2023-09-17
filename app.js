const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLogin } = require('./middleware/auth');
const User = require('./models/user');
require('dotenv').config();

app.use(express.json());
const jwtSecret = process.env.JWT_SECRET;

app.get('/home', isLogin, async (req, res) => {
    return res.json({
        mensagem: 'Test home pag',
        idUser: req.userId,
    });
});

app.get('/list/users', isLogin, async (req, res) => {

    try {
        const allUsers = await User.findAll({
            attributes: ['id', 'name', 'email'], // return filds id, name and email at the db
        });

        if (allUsers.length === 0) {
            return res.status(404).json({
                message: "dont exist users in db",
            });
        }

        res.json(allUsers);

    } catch (error) {
        console.error('Erro ao listar usuários:', err);
        res.status(500).json({
            error: 'Erro ao listar usuários',
        });
    }
});

app.post('/register', async (req, res) => {
    try {
        let data = req.body; // data body request

        const userInDb = await User.findOne({
            where: {
                email: data.email,
            }
        });

        if (userInDb) {
            return res.status(400).json({
                message: "email alredy registred"
            })
        }

        data.password = await bcrypt.hash(data.password, 8);

        await User.create(data);

        return res.json({
            message: "user registred",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "error for registre user"
        });
    }
});

app.post('/login', async (req, res) => {
    console.log(req.body);

    const user = await User.findOne({
        field: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });

    if (!user) {
        return res.status(401).json({
            error: "user not find",
        });
    };

    if (user.loginAttempts >= 3 && user.lastLoginAttempt) {
        const currentTime = new Date();
        const lastAttemptTime = new Date(user.lastLoginAttempt);
        const timeSinceLastAttempt = (currentTime - lastAttemptTime) / (1000 * 60);

        if (timeSinceLastAttempt < 15) { // block for 15 minutes
            return res.status(401).json({
                error: "Account temporarily locked. Please try again later.",
            });
        }
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        user.loginAttempts++;
        user.lastLoginAttempt = new Date();
        await user.save();

        return res.status(401).json({
            error: "invalid password",
        });
    }

    user.loginAttempts = 0;
    user.lastLoginAttempt = null;
    await user.save();

    let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '7d'
    });

    return res.json({
        mensagem: "sucess",
        token: token
    });
});

app.put('/update/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userUpdate = req.body;
        const hashedPassword = await bcrypt.hash(userUpdate.password, 8);

        const user = await User.findOne({
            where: { id: id }
        });

        if (!user) {
            return res.status(404).json({ error: 'user not find' });
        }

        if (!userUpdate.name || !userUpdate.email || !userUpdate.password) {
            return res.status(400).json({ error: 'name, email, and password are required fields' });
        }

        const updatedUser = await User.update(
            {
                name: userUpdate.name,
                email: userUpdate.email,
                password: hashedPassword,
            },
            {
                where: { id: id },
            },
        );

        if (updatedUser[0] === 0) {
            return res.status(500).json({ error: 'Failed to update user' });
        }

        return res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.log('error: ' + error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deleteUserDb = await User.destroy({
            where: { id: id },
        });

        if (deleteUserDb === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        return res.status(200).json({
            mensagem: 'user deleted',
        });

    } catch (error) {
        console.log('error: ' + error);
    }
});

app.listen(8080, () => {
    console.log('server Running -> http://localhost:8080'); // port: 8080
});
