const Order = require('../models/order.model')
const Client = require('../models/client.model');
const utils = require('../utils/utils')


const postCreateOrderSea = async (req, res, next) => {
    try {
        // const { sub } = req.user
        const sub = '62da2f1040a76e8114d54ba7'
        const { transportType, productType, productQuantity, registerDate,deliveryDate, deliveryPrice, portDelivery, fleetNumber,guideNumber } = req.body.values
        const { createDiscount,validateFields } = utils

        const validFields = validateFields(registerDate,deliveryDate,guideNumber,fleetNumber,transportType)
        if (!validFields) {
            res.status(400).json({ message: 'Fields Entered MUST be valid' })
        }
 

        let itemsToAdd 
        if(transportType==='sea'){
            itemsToAdd = { transportType, productType, productQuantity, registerDate,deliveryDate, deliveryPrice, portDelivery, fleetNumber,guideNumber }
        }else {
            const wareHouseDelivery = portDelivery
            const deliveryVehicle = fleetNumber
            itemsToAdd = { transportType, productType, productQuantity, registerDate,deliveryDate, deliveryPrice, wareHouseDelivery, deliveryVehicle,guideNumber }
        }
        
        
        if (!transportType || !productType || !productQuantity || !deliveryDate || !deliveryPrice || !portDelivery || !fleetNumber) {
            res.status(400).json({ message: 'Request Error invalid parameters type' })
        }
        

        const deliveryDiscount = createDiscount(transportType, +deliveryPrice, +productQuantity)
       
        if (!itemsToAdd) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const client = await Client.findById(sub)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        const order = new Order({ clientId: sub, deliveryDiscount, ...itemsToAdd })
        await order.save();
        client.clientOrders.push(order._id)
        await client.save()


        res.status(200).json({ message: 'Orders Added Successfully',orderId:order._id})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id
    // const { sub } = req.user
    const sub = '62da2f1040a76e8114d54ba7'
    try {
        if (!orderId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const client = await Client.findById(sub)
        if (!client) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        client.clientOrders = client.clientOrders.filter(order=>!order.equals(orderId))
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
    const { ...itemsToEdit } = req.body
    try {
        if (!orderId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const order = await Order.find({ clientId: sub })
        if (!order) {
            res.status(400).json({ message: 'Request could not be processed' })
        }
        order = { ...order, itemsToEdit }
        await order.save()

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



const ITEMS_PER_PAGE = 10

const getAllOrders = async (req, res, next) => {
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Order.estimatedDocumentCount(query)
        const ordersPromise = Order.find(query).limit(itemsPerPage).skip(skip)

        const [count,orders] = await Promise.all([countPromise,ordersPromise])

        const pageCount = Math.ceil(count/itemsPerPage)

        if (!orders) {
            res.status(400).json({ message: 'No orders found' })
        }
        res.status(200).json({ message: 'Orders found Successfully', pagination:{count,pageCount,itemsPerPage},orders })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}






module.exports = {
    deleteOrder,
    getAllOrders,
    getClientOrder,
    patchEditOrder,
    postCreateOrderSea
}
