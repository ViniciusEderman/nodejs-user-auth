const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLogin } = require('./middleware/auth');
const User = require('./models/user');
require('dotenv').config();

app.use(express.json());
const jwtSecret = process.env.JWT_SECRET;

app.get('/', isLogin, async (req, res) => {
    return res.json({
        mensagem: 'Test home pag',
        idUser: req.userId,
    });
});

app.post('/register', async (req, res) => {
    let data = req.body;
    data.password = await bcrypt.hash(data.password, 8);

    await User.create(data).then(() => {
        return res.json({
            mensagem: "user registred",
        });
    }).catch((err) => {
        return res.status(400).json({
            mensagem: "user not registred",
        });
        console.log(err);
    });
});

app.post('/login', async (req, res) => {
    console.log(req.body);

    const user = await User.findOne({
        fild: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });

    if(user === null) {
        return res.status(401).json({
            error: "user not find", 
        });
    };

    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(401).json({
            error: "invalid password", 
        });
    }

    let token = jwt.sign({id: user.id}, jwtSecret, {
        expiresIn: '7d'
    });

    return res.json({
        mensagem: "sucess",
        token: token
    });
});

app.put('/update/user/:id', async (req, res) =>{
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
        
    }catch (error) {
        console.log('error: ' + error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/:id', async (req, res) => {
    try{
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

    }catch(error){
        console.log('error: ' + error);
    }
});

app.listen(8080, () => {
    console.log('server Running -> http://localhost:8080'); // port: 8080
});
