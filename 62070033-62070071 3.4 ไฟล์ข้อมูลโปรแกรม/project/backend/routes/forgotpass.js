const express = require('express')
const dbconnection = require("../database")
const Joi = require('joi')
const nodemailer = require('nodemailer')
const {generateToken} = require("../utils/token")
const bcrypt = require('bcrypt')
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

const emailSchema = Joi.object({
    email: Joi.string().required()
})

const resetSchema = Joi.object({
    password: Joi.string().custom(passwordValidator).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
})

router.post('/forgotpassword', async function (req, res, next) {
    try {
        await emailSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const email = req.body.email
    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();

    try{
        const [users] = await conn.query("SELECT * FROM users WHERE email = ?", [email])
        const user = users[0]

        if(!user){
            throw new Error('Incorrect Email')
        }

        const token = generateToken()
        await conn.query("INSERT INTO tokens(users_id, token, created) VALUES(?, ?, CURRENT_TIMESTAMP())", [user.id, token])

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'noti.dhss@gmail.com',
              pass: 'xqeatlfqlgnfzodp'
            }
        });

        const mailOptions = {
            from: 'noti.dhss@gmail.com',
            to: user.email,
            subject: 'Drinking Healthy State System',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <template>
                    <p>Change Your Password <a href="http://localhost:8080/reset/${encodeURIComponent(token)}">here</a></p>
                </template>
            </body>
            </html>`,
          };

        await transporter.sendMail(mailOptions)
        conn.commit()
        res.status(201).send("Check Your Email")
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

router.post('/reset/:token', async function (req, res, next) {

    try {
        await resetSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const token = decodeURIComponent(req.params.token)
    const password = await bcrypt.hash(req.body.password, 12)

    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();

    try{
        const [users] = await conn.query("SELECT * FROM tokens WHERE token = ?", [token])
        const user = users[0]

        if(!user){
            throw new Error('Invalid Token')
        }

        await conn.query("UPDATE users SET password = ? WHERE id = ?", [password, user.users_id])
        await conn.query('DELETE FROM tokens WHERE id = ?', [user.id]);
        conn.commit()
        res.status(201).send("Change Password Success")
    } catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    } finally{
        conn.release();
    }
})

exports.router = router