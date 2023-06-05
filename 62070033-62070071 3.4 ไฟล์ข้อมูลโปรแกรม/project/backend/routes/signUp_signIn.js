const express = require('express')
const bcrypt = require('bcrypt')
const dbconnection = require('../database')
const Joi = require('joi')
const {generateToken} = require("../utils/token")
const { isLoggedIn } = require('../middlewares/index')
const { helpers } = require('vuelidate/lib/validators')
const router = express.Router()

const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const usernameValidator = async (value, helpers) => {
    const [rows, fields] = await dbconnection.query(
        "SELECT user_name FROM users WHERE user_name = ?", 
        [value]
    )
    if (rows.length > 0) {
        const message = 'This user is already taken'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const emailValidator = async (value, helpers) =>{
    const [rows, fields] = await dbconnection.query(
        "SELECT email FROM users WHERE email = ?", 
        [value]
    )
    if (rows.length > 0) {
        const message = 'This email is already taken'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const signupSchema = Joi.object({
    username: Joi.string().min(6).external(usernameValidator).required(),
    email: Joi.string().email().external(emailValidator).required(),
    password: Joi.string().custom(passwordValidator).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    weight: Joi.number().min(30).max(120).required(),
    date: Joi.string().required()
})

const signinSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

router.get('/user/me', isLoggedIn, async function (req, res, next){
    res.json(req.user)
})

router.post('/signup', async function (req, res, next){

    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const username = req.body.username
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 12)
    const weight = parseFloat(req.body.weight)
    const date = req.body.date

    const conn = await dbconnection.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("INSERT INTO users (user_name, email, password, weight, dob, created) VALUES(?, ?, ?, ?, ?, CURDATE())", [username, email, password, weight, date])
        await conn.query("INSERT INTO user_rewards (date_redeemed, users_id, reward_id) VALUES(CURDATE(), (SELECT MAX(id) FROM users), 1)")
        conn.commit()
        res.status(201).send()
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release();
    }
})

router.post('/signin', async function (req, res, next){

    try {
        await signinSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const email = req.body.email
    const password = req.body.password

    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();

    try{
        const [users] = await conn.query("SELECT * FROM users WHERE email = ?", [email])
        const user = users[0]

        if(!user){
            throw new Error('Incorrect username or password')
        }

        if(!(await bcrypt.compare(password, user.password))){
            throw new Error('Incorrect username or password')
        }

        const [tokens] = await conn.query("SELECT * FROM tokens WHERE users_id = ?", [user.id])
        let token = tokens[0]?.token
        if(!token){
            token = generateToken()
            await conn.query("INSERT INTO tokens(users_id, token, created) VALUES(?, ?, CURRENT_TIMESTAMP())", [user.id, token])
        }
        conn.commit()
        res.status(200).json({'token': token})
    }catch(err){
        conn.rollback()
        res.status(401).json(err.toString())
    }finally{
        conn.release();
    }
})

exports.router = router