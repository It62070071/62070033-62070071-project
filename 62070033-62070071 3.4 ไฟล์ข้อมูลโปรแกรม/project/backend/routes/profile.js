const express = require('express')
const dbconnection = require('../database')
const Joi = require('joi')
const { isLoggedIn } = require('../middlewares/index')
const { helpers } = require('vuelidate/lib/validators')
const moment = require('moment')
const router = express.Router()

const editSchema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    weight: Joi.number().min(30).max(120).required(),
    date: Joi.string().required()
})

router.get('/profile/:id', isLoggedIn, async function(req, res, next){
    const userID = req.params.id
    try{
        const [user, rows1] = await dbconnection.query("SELECT user_name, email, weight, dob FROM users WHERE id = ?", [userID])
        res.json({
            user_name: user[0].user_name,
            email: user[0].email,
            weight: user[0].weight,
            dob: moment(user[0].dob).format('YYYY-MM-DD'),
        })
    }catch(err){
        return next(err)
    }
})

router.post('/profile/:id', isLoggedIn, async function(req, res, next){
    const userID = req.params.id
    try {
        await editSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const username = req.body.username
    const email = req.body.email
    const weight = parseFloat(req.body.weight)
    const date = req.body.date

    const conn = await dbconnection.getConnection()
    await conn.beginTransaction()

    try{
        const [users] = await conn.query("SELECT user_name, email, weight, dob FROM users WHERE id = ?", [userID])
        const user = users[0]

        if(user.user_name !== username){
            const [rows, fields] = await dbconnection.query(
                "SELECT user_name, id FROM users WHERE user_name = ?", 
                [username]
            )
            if(rows.length > 0){
                throw new Error('This user is already taken')
            }
            await conn.query("UPDATE users SET user_name = ? WHERE id = ?", [username, userID])
        }

        if( user.email !== email){
            const [rows, fields] = await dbconnection.query(
                "SELECT email, id FROM users WHERE email = ?", 
                [email]
            )
            if(rows.length > 0){
                throw new Error('This email is already taken')
            }
            await conn.query("UPDATE users SET email = ? WHERE id = ?", [email, userID])
        }

        if(user.weight !== weight){
            await conn.query("UPDATE users SET weight = ? WHERE id = ?", [weight, userID])
        }

        if(user.dob !== date){
            await conn.query("UPDATE users SET dob = ? WHERE id = ?", [date, userID])
        }

        conn.commit()
        res.status(201).send("Edit Profile Success")
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

exports.router = router