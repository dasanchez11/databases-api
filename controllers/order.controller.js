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

        const client = await Client.findById(clientToAddOrder)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        const order = new Order({ clientId: clientToAddOrder,...values })
        await order.save();
        client.clientOrders.push(order._id)
        await client.save()


        res.status(200).json({ message: 'Orders Added Successfully', orderId: order._id })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const postDeleteOrder = async (req, res, next) => {
    const { orderId, clientId } = req.params.id
    const { sub, role } = req.user

    let clientIdToDelete
    if (role === 'admin') {
        clientIdToDelete = clientId
    } else {
        clientIdToDelete = sub
    }

    try {
        if (!orderId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const client = await Client.findById(clientIdToDelete)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        if (!client.clientOrders.includes(orderId)) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        client.clientOrders = client.clientOrders.filter(order => !order.equals(orderId))
        await client.save()

        const order = await Order.findByIdAndDelete(orderId)
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

        const order = await Order.findById(orderId)
        if (!order) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        if (!order.clientId.equals(itemsToEdit.clientId)) {
            //Delete order from client
            const client = await Client.findById(order.clientId)
            if (!client) {
                res.status(400).json({ message: 'Request could not be processed' })
            }

            const hasElement = client.clientOrders.filter(element => element.equals(orderId))

            if (!hasElement.length > 0) {
                res.status(400).json({ message: 'Request could not be processed' })
            }

            client.clientOrders = client.clientOrders.filter(order => !order.equals(orderId))
            await client.save()

            //add order to new client
            const newClient = await Client.findById(itemsToEdit.clientId)
            if (!newClient) {
                res.status(400).json({ message: 'Request could not be processed' })
            }
            newClient.clientOrders.push(order._id)
            await newClient.save()
        }

        itemsToEdit = { ...itemsToEdit, clientId: clientIdToEdit }
        await Order.findByIdAndUpdate(orderId, { ...itemsToEdit })

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
        query = {clientId:sub}
    }
    
    try {
        const skip = (page - 1) * itemsPerPage
        const countPromise = Order.countDocuments(query)
        const ordersPromise = Order.find(query).limit(itemsPerPage).skip(skip)

        const [count, orders] = await Promise.all([countPromise, ordersPromise])
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
