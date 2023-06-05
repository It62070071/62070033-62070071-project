const express = require('express')
const dbconnection = require('../database')
const cron = require('node-cron')
const nodemailer = require('nodemailer')
const router = express.Router()

async function getUsers() {
    const conn = await dbconnection.getConnection()
    const [rows, fields] = await conn.query('SELECT * FROM users')
    conn.release()
    return rows;
}

async function sendNotifications1() {
  const users = await getUsers()
  for (const user of users) {
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
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
          <title>Document</title>
      </head>
      <body>
          <div class="container">
              <div class="columns mt-2 ml-2 mr-2">
                  <div class="column is-3">
                      <div class="card">
                          <div class="card-image">
                            <figure class="image is-square">
                              <img src="https://i.imgur.com/sUsNCHJ.jpg" alt="Placeholder image" style="height: 480px; width: 480px;">
                            </figure>
                          </div>
                          <div class="card-content">
                              <div class="media-content">
                                  <p class="title is-3">${user.user_name}</p>
                                  <p class="title is-4">Time To Drink Water, After You Wake Up You Should Drink Water</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`
    };
  
    await transporter.sendMail(mailOptions);
  }
  console.log("Send")
}

async function sendNotifications2() {
  const users = await getUsers()
  const conn = await dbconnection.getConnection()
  for (const user of users) {
    const [rows1, fiedls1] = await conn.query("SELECT total FROM daily_total WHERE users_id = ? AND drinks = 'Beer' AND date = CURDATE()", [user.id])
    if(rows1.length !== 0 &&  rows1[0].total >= 900){
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                              <figure class="image is-square">
                                <img src="https://i.imgur.com/ZdgILtX.jpg" alt="Placeholder image" style="height: 480px; width: 480px;">
                              </figure>
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-3">${user.user_name}</p>
                                    <p class="title is-4">Hey!, you drink beer too much for today!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      await transporter.sendMail(mailOptions);
      console.log("Send")

      await conn.query("DELETE FROM daily_total WHERE drinks = 'Beer'");
    }
  }
}

async function sendNotifications3() {
  const users = await getUsers()
  const conn = await dbconnection.getConnection()
  for (const user of users) {
    const [rows2, fields2] = await conn.query("SELECT total FROM daily_total WHERE users_id = ? AND drinks = 'Soft Drink' AND date = CURDATE()", [user.id])
    if(rows2.length !== 0 && rows2[0].total >= 180){
      console.log(rows2[0].total)
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                              <figure class="image is-square">
                                <img src="https://i.imgur.com/71ubwYY.jpg" alt="Placeholder image" style="height: 480px; width: 480px;">
                              </figure>
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-3">${user.user_name}</p>
                                    <p class="title is-4">Hey!, you drink softdrink too much for today!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      await transporter.sendMail(mailOptions);
      console.log("Send")

      await conn.query("DELETE FROM daily_total WHERE drinks = 'Soft Drink'");
    }
  }
}

async function sendNotifications4() {
  const users = await getUsers()
  for (const user of users) {
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                              <figure class="image is-square">
                                <img src="https://i.imgur.com/P5kPOgS.jpg" alt="Placeholder image" style="height: 480px; width: 480px;">
                              </figure>
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-3">${user.user_name}</p>
                                    <p class="title is-4">Time To Drink Water, Before You Eat Lunch Around 30 Minute You Should Drink Water</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      await transporter.sendMail(mailOptions);
  }
  // console.log("Send")
}

async function sendNotifications5() {
  const users = await getUsers()
  for (const user of users) {
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                              <figure class="image is-square">
                                <img src="https://i.imgur.com/UkohlIj.jpg" alt="Placeholder image" style="height: 480px; width: 480px;">
                              </figure>
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-3">${user.user_name}</p>
                                    <p class="title is-4">Time To Drink Water, Before You Going To Sleep Around 30 Minute You Should Drink Water</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      await transporter.sendMail(mailOptions);
  }
  console.log("Send")
}

async function sendNotifications6() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noti.dhss@gmail.com',
        pass: 'xqeatlfqlgnfzodp'
      }
    });

    const mailOptions = {
      from: 'noti.dhss@gmail.com',
      to: 'trigger@applet.ifttt.com',
      subject: 'Drinking Healthy State System #DHSS',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
          <title>Document</title>
      </head>
      <body>
          <div class="container">
              <div class="columns mt-2 ml-2 mr-2">
                  <div class="column is-3">
                      <div class="card">
                          <div class="card-image">
                          </div>
                          <div class="card-content">
                              <div class="media-content">
                                  <p class="title is-4">Time To Drink Water, After You Wake Up You Should Drink Water</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`
    };
    await transporter.sendMail(mailOptions);
  console.log("Send")
}

async function sendNotifications7() {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noti.dhss@gmail.com',
          pass: 'xqeatlfqlgnfzodp'
        }
      });
  
      const mailOptions = {
        from: 'noti.dhss@gmail.com',
        to: 'trigger@applet.ifttt.com',
        subject: 'Drinking Healthy State System #DHSS',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-4">Time To Drink Water, Before You Eat Lunch Around 30 Minute You Should Drink Water</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      await transporter.sendMail(mailOptions);
}

function sendNotifications8() {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noti.dhss@gmail.com',
          pass: 'xqeatlfqlgnfzodp'
        }
      });
  
      const mailOptions = {
        from: 'noti.dhss@gmail.com',
        to: 'trigger@applet.ifttt.com',
        subject: 'Drinking Healthy State System #DHSS',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
            <title>Document</title>
        </head>
        <body>
            <div class="container">
                <div class="columns mt-2 ml-2 mr-2">
                    <div class="column is-3">
                        <div class="card">
                            <div class="card-image">
                            </div>
                            <div class="card-content">
                                <div class="media-content">
                                    <p class="title is-4">Time To Drink Water, Before You Going To Sleep Around 30 Minute You Should Drink Water</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`
      };
    
      transporter.sendMail(mailOptions);
      console.log("Send")
}

cron.schedule('0 7 * * *', async () => {
    sendNotifications1()
    sendNotifications6()
})

cron.schedule('* * * * *', async () => {
    sendNotifications2()
})

cron.schedule('* * * * *', async () => {
    sendNotifications3()
})

cron.schedule('30 11 * * *', async () => {
    sendNotifications4()
    sendNotifications7()
})

cron.schedule('30 17 * * *', async () => {
    sendNotifications4()
    sendNotifications7()
})

cron.schedule('0 21 * * *', async () => {
    sendNotifications5()
    sendNotifications8()
})

// sendNotifications8()

exports.router = router