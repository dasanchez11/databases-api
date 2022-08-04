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
app.get('/app/csrf-token',(req,res)=>{ 
    res.json({csrfToken:req.csrfToken()})
})

const orderRoutes = require('./routes/orders.routes')
app.use('/app/order',orderRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/app/user',userRoutes)

const truckRoutes = require('./routes/truck.routes')
app.use('/app/truck',truckRoutes)

const shipRoutes = require('./routes/ship.routes')
app.use('/app/ship',shipRoutes)



mongoose.connect(process.env.MONGO_DB_URL)
    .then(res => {
        const server = app.listen(process.env.PORT)
        console.log('app running on port', process.env.PORT)
    }).catch(error => {
        console.log(error)
    })