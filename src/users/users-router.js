const express = require('express')
const path = require('path')
const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { username, user_password } = req.body;

    for (const field of ['username', 'user_password']) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        }
    }

    const passwordError = UsersService.validatePassword(user_password);

    if (passwordError) {
        return res.status(400).json({ error: passwordError })
    }

    UsersService.hasUserWithUserName(
        req.app.get('db'),
        username
    )
        .then(hasUserWithUserName => {
            if (hasUserWithUserName) {
                return res.status(400).json({ error: `Username already taken` })
            }
            
            return UsersService.hashPassword(user_password)
                .then(hashedPassword => {      
                    const newUser = {
                        username,
                        user_password: hashedPassword,
                    };
        
                    return UsersService.insertUser(
                        req.app.get('db'),
                        newUser
                    )
                        .then(user => {
                            const sub = user.username;
                            const payload = { user_id: user.id };
                            let jwt = AuthService.createJwt(sub, payload);
                            res
                                .status(201)
                                .json(jwt)
                        })
                })
        })
        .catch(next)
    
  })

module.exports = usersRouter
