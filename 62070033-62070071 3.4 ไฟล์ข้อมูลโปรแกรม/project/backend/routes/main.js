const express = require('express')
const dbconnection = require('../database')
const cron = require('node-cron')
const Joi = require('joi')
const moment = require('moment')
const { isLoggedIn } = require('../middlewares/index')
const router = express.Router()

// function age(birthdate) {
//     const today = new Date();
//     const age = today.getFullYear() - birthdate.getFullYear() - 
//                (today.getMonth() < birthdate.getMonth() || 
//                (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
//     return age
// }

function calDate(current){

    // Get the last day of the month
    const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    // Calculate the difference in days between today and the last day of the month
    const diffInDays = Math.round((lastDayOfMonth - current) / (1000 * 60 * 60 * 24));

    return diffInDays
     // Output: number of days between today and the last day of the month
}

function calculateAmount(weight) {
    const water = (weight * 2.2 * 30) / 2
    return water
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

function updateAmountForNewMonth(weight, created) {
    // Get the current date and the last day of the current month
    const currentDate = new Date();
    const firstDay = getFirstDayOfMonth(
        currentDate.getFullYear(),
        currentDate.getMonth(),
    )

    // Check if the current date is after the last day of the month when the user was created
    if (firstDay > created) {
        const daysInMonth = calDate(firstDay)
        // Calculate the new amount for the current month based on the number of days in the month
        const newAmount = (daysInMonth + 1) * calculateAmount(weight)
        return newAmount
    }
    else{
        const daysInMonth = calDate(created)
        const oldAmount = (daysInMonth + 1) * calculateAmount(weight)
        return oldAmount
    }
}

const recordSchema = Joi.object({
    drinks: Joi.string().required(),
    amount: Joi.number().required()
})

router.get('/main/:id', isLoggedIn, async function(req, res, next){

    const userID = req.params.id

    try{
        const [userRows, fields1] = await dbconnection.query("SELECT * FROM users WHERE id = ?", [userID])

        const [rewardRows, fields2] = await dbconnection.query(
            "SELECT r.name, l.rank, ur.date_redeemed\
            FROM user_rewards ur\
            JOIN reward r ON ur.reward_id = r.id\
            JOIN level l ON r.level_id = l.id\
            WHERE ur.users_id = ?\
            ORDER BY ur.id DESC",[userID]
        )

        const [consumptionRows, fields3] = await dbconnection.query("SELECT * FROM drinks_consumption WHERE users_id = ?", [userID])

        const [waterRows1, fields4] = await dbconnection.query("SELECT COALESCE(SUM(amount), 0) AS total_amount FROM drinks_consumption WHERE users_id = ? AND drinks = 'Water' AND date = CURDATE()", [userID])
        const [waterRows2, fields5] = await dbconnection.query("SELECT COALESCE(SUM(amount), 0) AS total_amount FROM drinks_consumption WHERE users_id = ? AND drinks = 'Water' AND MONTH(date) = MONTH(now()) AND YEAR(date) = YEAR(now())", [userID])

        const [beer, fields6] = await dbconnection.query("SELECT COALESCE(SUM(amount), 0) AS total_amount FROM drinks_consumption WHERE users_id = ? AND drinks = 'Beer' AND date = CURDATE()", [userID])
        const [softdrink, fields7] = await dbconnection.query("SELECT COALESCE(SUM(amount), 0) AS total_amount FROM drinks_consumption WHERE users_id = ? AND drinks = 'Soft Drink' AND date = CURDATE()", [userID])

        const [dataRows1, fields8] = await dbconnection.query(
            "SELECT date, SUM(amount) AS total_amount \
             FROM drinks_consumption \
             WHERE users_id = ? AND drinks = 'Water' AND week(date) = week(now())\
             GROUP BY date \
             ORDER BY date ASC",
            [userID]
        )

        const next_level = userRows[0].level_id + 1
        const [level, fiedls9] = await dbconnection.query("SELECT required_points FROM level WHERE id = ?", [next_level])

        const [dataRows2, fields10] = await dbconnection.query(
            "SELECT date, SUM(amount) AS total_amount \
             FROM drinks_consumption \
             WHERE users_id = ? AND drinks = 'Beer' AND week(date) = week(now())\
             GROUP BY date \
             ORDER BY date ASC",
            [userID]
        )

        //week(date) = week(now()) show current week

        const [dataRows3, fields11] = await dbconnection.query(
            "SELECT date, SUM(amount) AS total_amount \
             FROM drinks_consumption \
             WHERE users_id = ? AND drinks = 'Soft Drink' AND week(date) = week(now())\
             GROUP BY date \
             ORDER BY date ASC",
            [userID]
        )

        const [dataRows4, fields12] = await dbconnection.query(
            "SELECT MONTH(date) AS month, SUM(amount) AS total_amount \
            FROM drinks_consumption \
            WHERE users_id = ? AND drinks = 'Water' AND YEAR(date) = YEAR(now()) \
            GROUP BY month \
            ORDER BY month ASC",
            [userID]
        )

        res.json({
            username: userRows[0].user_name,
            points: userRows[0].reward_points,
            required: level[0].required_points,
            rewards: rewardRows[0].name,
            ranks: rewardRows[0].rank,
            recive: calculateAmount(userRows[0].weight).toFixed(0),
            amount_month: updateAmountForNewMonth(userRows[0].weight, userRows[0].created).toFixed(0),
            water1: waterRows1[0].total_amount,
            water2: waterRows2[0].total_amount,
            beer: beer[0].total_amount,
            softdrink: softdrink[0].total_amount,
            data1: dataRows1,
            data2: dataRows2,
            data3: dataRows3,
            data4: dataRows4
        })
    }catch(err){
        return next(err)
    }
})

router.post('/main/:id', isLoggedIn, async (req, res, next) => {
    const userID = req.params.id

    try {
        await recordSchema.validateAsync(req.body,  { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const drinks_type = req.body.drinks
    const amount = req.body.amount

    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();

    try{
        const [rows, fields1] = await conn.query(
            "INSERT INTO drinks_consumption(drinks, amount, date, users_id) VALUES(?, ?, CURDATE(), ?)",[drinks_type, amount, userID]
        )
        const [daily_Total, fields2] = await conn.query(
            "INSERT INTO daily_total (users_id, date, total, drinks)\
            VALUES (?, CURDATE(), ?, ?)\
            ON DUPLICATE KEY UPDATE total = total + VALUES(total)",[userID, amount, drinks_type]
        )
        conn.commit()
        res.status(201).send()
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release();
    }
})

cron.schedule('* * * * * *', async () => {
    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();
    try {
        // Get all users from the database
        const [userRows, fields1] = await conn.query("SELECT * FROM users");

        // Loop through each user and check if their total consumption matches
        for (const user of userRows) {
            const [consumptionRows, fields2] = await conn.query("SELECT total FROM daily_total WHERE users_id = ? AND drinks = 'Water' AND date = CURDATE()", [user.id])
            if (consumptionRows.length !== 0 && consumptionRows[0].total >= (calculateAmount(user.weight).toFixed(0))) {
                // Update the user's reward points
                const points = user.reward_points + 100;
                await conn.query("UPDATE users SET reward_points = ? WHERE id = ?", [points, user.id]);

                // Delete row in the daily_total table with the user's ID
                await conn.query("DELETE FROM daily_total WHERE drinks = 'Water' AND users_id = ?", [user.id])
            }
        }
        conn.commit()
      } catch (err) {
        conn.rollback()
        console.error(err);
      } finally{
        conn.release();
      }
})

cron.schedule('* * * * * *', async () => {
    const conn = await dbconnection.getConnection()
    await conn.beginTransaction();
    try {
        // Get all users from the database
        const [userRows, fields1] = await conn.query("SELECT * FROM users");
        // Loop through each user and check if their total consumption matches
        for (const user of userRows) {
            const [level, fields2] = await conn.query("SELECT required_points FROM level WHERE id = ?", [user.level_id + 1]);
            const [reward, fields3] = await conn.query("SELECT MAX(reward_id) FROM user_rewards WHERE users_id = ?", [user.id])
            const [max, fields4] = await conn.query("SELECT MAX(id) as maxLevel FROM level")
            const requiredPoints = level[0].required_points;
            const reward_id = reward[0]['MAX(reward_id)'] !== null ? reward[0]['MAX(reward_id)'] + 1 : 1;

          if (user.reward_points >= requiredPoints && user.level_id < max[0].maxLevel) {
            // Update the user's reward points
            await conn.query("UPDATE users SET level_id = level_id + 1, reward_points = reward_points - ? WHERE id = ?", [requiredPoints, user.id]);

            await conn.query("INSERT INTO user_rewards(date_redeemed, users_id, reward_id) VALUES(CURDATE(), ?, ?)", [user.id, reward_id])
          }
        }
        conn.commit()
      } catch (err) {
        conn.rollback()
        console.error(err)
      } finally{
        conn.release()
      }
})

exports.router = router