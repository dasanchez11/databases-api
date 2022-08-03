const Truck = require('../models/truck.model');


const ITEMS_PER_PAGE = 5

const getAllTrucks = async (req,res,next) =>{
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Truck.estimatedDocumentCount(query)
        const trucksPromise = Truck.find(query).limit(itemsPerPage).skip(skip)

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

}


const deleteTruck = async (req,res,next) =>{
    const {truckId} = req.params
    const { sub } = req.user
    try {
        if (!truckId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const truck = await Truck.findByIdAndDelete(truckId)
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

}



module.exports = {
    getAllTrucks,
    patchEditTruck,
    deleteTruck,
    postCreateTruck
}