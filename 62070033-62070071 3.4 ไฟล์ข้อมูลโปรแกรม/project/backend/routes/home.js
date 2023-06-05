const express = require('express')
const { isLoggedIn } = require('../middlewares/index')
const router = express.Router()

router.get('/home', isLoggedIn, async function(req, res, next){
    res.send("Hello")
})

exports.router = router