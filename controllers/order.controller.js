const Order = require('../models/order.model')
const Client = require('../models/client.model');
const utils = require('../utils/utils')
 

const postCreateOrderSea = async (req, res, next) => {
    try {
        const { sub ,role} = req.user
        const { values } = req.body
        const { createDiscount, validateFields } = utils

        let clientToAddOrder
        if (role === 'admin') {
            clientToAddOrder = values.clientId
        } else {
            clientToAddOrder = sub
        }

        // const validFields = validateFields(registerDate, deliveryDate, guideNumber, fleetNumber, transportType)
        // if (!validFields) {
        //     res.status(400).json({ message: 'Fields Entered MUST be valid' })
        // }


        const deliveryDiscount = createDiscount(values.transportType, +values.deliveryPrice, +values.productQuantity) === values.deliveryDiscount

        if (!deliveryDiscount) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        if (!values) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const client = await Client.findByPk(clientToAddOrder)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        const order = await client.createOrder(values)
        // const order = new Order({ clientId: clientToAddOrder,...values })
        // await order.save();
        // client.clientOrders.push(order._id)
        // await client.save() 
 

        res.status(200).json({ message: 'Orders Added Successfully', orderId: order.dataValues._id })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const postDeleteOrder = async (req, res, next) => {
    console.log(req.body)
    const { itemId, clientId } = req.body
    const { sub, role } = req.user

    let clientIdToDelete
    if (role === 'admin') {
        clientIdToDelete = clientId
    } else {
        clientIdToDelete = sub
    }

    try {
        if (!itemId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const client = await Client.findByPk(clientIdToDelete)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const order = await Order.destroy({where:{_id:itemId,clientId:clientIdToDelete}})
        if (!order) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        res.status(200).json({ message: 'Order Deleted Successfully' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}

const patchEditOrder = async (req, res, next) => {
    const orderId = req.params.id
    const { sub, role } = req.user
    let { itemsToEdit } = req.body

    let clientIdToEdit
    if (role === 'admin') {
        clientIdToEdit = itemsToEdit.clientId
    } else {
        clientIdToEdit = sub
    }

    try {

        if (!orderId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const order = await Order.findByPk(orderId)
        if (!order) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        
        itemsToEdit = { ...itemsToEdit, clientId: clientIdToEdit }
        await Order.update(itemsToEdit,{where:{_id:orderId}})

        res.status(200).json({ message: 'Orders Edited Successfully' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}

const getClientOrder = async (req, res, next) => {
    const { sub } = req.user
    try {
        if (!sub) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const orders = await Order.find({ clientId: sub })
        if (!orders) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        res.status(200).json({ message: 'Orders found Successfully', orders })


    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}



const ITEMS_PER_PAGE = 5

const getAllOrders = async (req, res, next) => {
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage || ITEMS_PER_PAGE
    let query
    const {sub,role} = req.user
    if(role==='admin'){
        query  = {}
    }else{
        query = {where:{clientId:sub}}
    }
    
    try {
        const skip = (page - 1) * itemsPerPage
        const countPromise = Order.count(query)
        const ordersPromise = Order.findAll({offset:skip, limit:itemsPerPage,query})

        const [count, orders] = await Promise.all([countPromise, ordersPromise])
        console.log('count',count)
        console.log('orders',orders)

        const pageCount = Math.ceil(count / itemsPerPage)
        
        if (!orders) {
            res.status(400).json({ message: 'No orders found' })
        }
        res.status(200).json({ message: 'Orders found Successfully', pagination: { count, pageCount, itemsPerPage }, orders })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}






module.exports = {
    postDeleteOrder,
    getAllOrders,
    getClientOrder,
    patchEditOrder,
    postCreateOrderSea
}
