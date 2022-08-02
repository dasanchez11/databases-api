require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')

const csrfProtection = csrf({
    cookie:true
})

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser())

const authenticateRoutes = require('./routes/authenticate.routes')
app.use('/authenticate',authenticateRoutes)

app.use(csrfProtection);
app.get('/order/csrf-token',(req,res)=>{ 
    res.json({csrfToken:req.csrfToken()})
})

const orderRoutes = require('./routes/orders.routes')
app.use('/order',orderRoutes)

// app.use('/wareHouse',)
// app.use('/port',)



mongoose.connect(process.env.MONGO_DB_URL)
    .then(res => {
        const server = app.listen(process.env.PORT)
        console.log('app running on port', process.env.PORT)
    }).catch(error => {
        console.log(error)
    })