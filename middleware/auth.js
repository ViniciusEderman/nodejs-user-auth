const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;


module.exports = {
  isLogin: async (req, res, next) => {
    const token = req.headers.authorization
    console.log(token);
    
    if (!token) {
        return res.status(401).json({ error: 'token not provided' });
    }

    const [, formatedToken] = token.split(' ');
    console.log(formatedToken);
    
    // check if the token was offered
    if(!formatedToken) {
        return res.status(401).json({ error: 'token not provided' });
    }

    try{
        const decoded = await promisify(jwt.verify)(formatedToken, jwtSecret);
        req.userId = decoded.id;

        return next();
    }catch{
        return res.status(401).json({ error: 'invalid token' });
    }
  }
}
