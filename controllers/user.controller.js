const { Sequelize } = require('sequelize')
const Client = require('../models/client.model')
const Order = require('../models/order.model')
const sequelize = require('../utils/database')



const ITEMS_PER_PAGE = 5
const getAllClients = async(req,res,next) =>{
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Client.count(query)
        const clientPromise = Client.findAll({
            include:{model:Order,attributes:[]},
            attributes:['_id','clientEmail','clientNit','clientName','clientRole',[Sequelize.fn('COUNT',Sequelize.col('orders._id')),'clientOrders']],
            group:'client._id',
            },{offset:skip, 
            limit:itemsPerPage}
        )
    
        let [count,clients] = await Promise.all([countPromise,clientPromise])
        const pageCount = Math.ceil(count/itemsPerPage)

        if (!clients) {
            res.status(400).json({ message: 'No Clients found' })
        }


        res.status(200).json({ message: 'Orders found Successfully', pagination:{count,pageCount,itemsPerPage},clients})

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const patchEditClient = async(req,res,next) =>{
    const {userData} = req.body
    const {clientId} = req.params
    const {clientName, clientNit, clientRole} = userData
    const data = {clientName,clientNit,clientRole}
    try {
        const client = await Client.update({...data},{where:{_id:clientId}})
        if(!client){
            res.status(400).json({ message: 'No Clients found' })
        }
        res.status(200).json({ message: 'Client Edited Successfully',client })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const getClientsOptions = async(req,res,next) =>{
    
    try {
        const clients = await Client.findAll({attributes:['_id','clientName']})
        if (!clients) {
            res.status(400).json({ message: 'No Clients found' })
        }
        
        res.status(200).json({ message: 'Orders found Successfully',clients})

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


module.exports = {
    getAllClients,
    patchEditClient,
    getClientsOptions
}