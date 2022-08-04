const Client = require('../models/client.model')


const ITEMS_PER_PAGE = 5
const getAllClients = async(req,res,next) =>{
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Client.estimatedDocumentCount(query)
        const clientPromise = Client.find(query,{clientPassword:0}).limit(itemsPerPage).skip(skip)

        const [count,clients] = await Promise.all([countPromise,clientPromise])

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
        const client = await Client.findByIdAndUpdate(clientId,{...data})
        if(!client){
            res.status(400).json({ message: 'No Clients found' })
        }

        client.save()
        res.status(200).json({ message: 'Client Edited Successfully',client })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const getClientsOptions = async(req,res,next) =>{
    
    try {
        const clients = await Client.find({},{clientName:1,_id:1})
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