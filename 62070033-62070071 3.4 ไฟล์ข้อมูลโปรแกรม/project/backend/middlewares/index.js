const dbconnection = require('../database')

// async function logger (req, res, next) {
//     const timestamp = new Date().toISOString().substring(0, 19)
//     console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
//     next()
// }

async function isLoggedIn (req, res, next) {

    let authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).send('You are not logged in')
    }

    let [part1, part2] = authorization.split(' ')
    if (part1 !== 'Bearer' || !part2) {
        return res.status(401).send('You are not logged in')
    }

    // Check token
    const [tokens] = await dbconnection.query('SELECT * FROM tokens WHERE token = ?', [part2])
    const token = tokens[0]
    if (!token) {
        return res.status(401).send('You are not logged in')
    }

    // Set user
    const [users] = await dbconnection.query(
        'SELECT u.id, u.user_name, u.email, l.rank FROM users u JOIN level l ON u.level_id = l.id WHERE u.id = ?', [token.users_id]
    )

    req.user = users[0]

    next()
}

module.exports = {
    isLoggedIn,
    // logger
}