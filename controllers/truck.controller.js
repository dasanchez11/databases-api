const { Sequelize } = require('sequelize');
const Truck = require('../models/truck.model');


const ITEMS_PER_PAGE = 5

const getAllTrucks = async (req,res,next) =>{
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Truck.count(query)
        const trucksPromise = Truck.findAll({offset:skip, limit:itemsPerPage,
            attributes:['truckId','status','capacity','model','year','brand',[Sequelize.literal('truck.truckId'),'_id']]})

        const [count,trucks] = await Promise.all([countPromise,trucksPromise])
        const pageCount = Math.ceil(count/itemsPerPage)

        if(!trucks){
            res.status(400).json({ message: 'Request could not be processed' })
        }

        res.status(200).json({ message: 'Trucks found Successfully',pagination:{count,pageCount,itemsPerPage},trucks })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const patchEditTruck = async (req,res,next) =>{
    const {truckInfo} = req.body
    const {_id,truckId,status,capacity,model,brand,year } = truckInfo
    const data = {truckId,status,capacity,model,brand,year}
    try {
        const truck = await Truck.update({...data},{where:{truckId:truckId}})
        
        if(!truck){
            res.status(400).json({ message: 'No Trucks found' })
        }
        res.status(200).json({ message: 'Truck Edited Successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const deleteTruck = async (req,res,next) =>{
    const {truckId} = req.params
    const { sub } = req.user
    try {
        if (!truckId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const truck = await Truck.destroy({where:{truckId:truckId}})
        if (!truck) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        res.status(200).json({ message: 'Truck Deleted Successfully' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}

const postCreateTruck = async (req,res,next) =>{
    const {truckInfo} = req.body
    const {truckId,status,capacity,model,brand,year } = truckInfo
    const data = {truckId,status,capacity,model,brand,year}
    try {
        const truck =  await Truck.create({...data})
        if(!truck){
            res.status(400).json({ message: 'No Trucks found' })
        }
        await truck.save()
        res.status(200).json({ message: 'Truck Added Successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}



module.exports = {
    getAllTrucks,
    patchEditTruck,
    deleteTruck,
    postCreateTruck
}