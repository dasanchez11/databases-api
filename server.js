require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const sequelize = require('./utils/database')
const Client = require('./models/client.model')
const Order = require('./models/order.model')
const Ship = require('./models/ship.model')
const Truck = require('./models/truck.model')




const csrfProtection = csrf({
    cookie: true
})

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser())

const authenticateRoutes = require('./routes/authenticate.routes')
app.use('/authenticate', authenticateRoutes)

app.use(csrfProtection);
app.get('/app/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

const orderRoutes = require('./routes/orders.routes')
app.use('/app/order', orderRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/app/user', userRoutes)

const truckRoutes = require('./routes/truck.routes')
app.use('/app/truck', truckRoutes)

const shipRoutes = require('./routes/ship.routes')
app.use('/app/ship', shipRoutes)




const start = async  () =>{
    try {
        await sequelize.authenticate();
        Order.belongsTo(Client,{constraints:true, onDelete:'CASCADE',onUpdate:'CASCADE'})
        Client.hasMany(Order)
        // Order.hasOne(Ship,{foreignKey:'shipId',sourceKey:'fleetNumber'})
        // Order.hasOne(Truck,{foreignKey:'truckId',sourceKey:'deliveryVehicle'})

        const server = app.listen(process.env.PORT)
        await sequelize.sync();
        console.log('app running on port', process.env.PORT)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } 
}
  
start()



