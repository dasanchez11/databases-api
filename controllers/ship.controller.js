const Ship = require('../models/ship.model');
const { Sequelize } = require('sequelize');



const ITEMS_PER_PAGE = 5

const getAllShips = async (req,res,next) =>{
    const page = req.query.page || 0
    const itemsPerPage = req.query.itemsPerPage||ITEMS_PER_PAGE
    const query={}
    try {
        const skip = (page-1)*itemsPerPage
        const countPromise = Ship.count(query)
        const shipsPromise = Ship.findAll({offset:skip, limit:itemsPerPage,
            attributes:['shipId','status','capacity','model','year','brand',[Sequelize.literal('ship.shipId'),'_id']]})
        const [count,ships] = await Promise.all([countPromise,shipsPromise])
        const pageCount = Math.ceil(count/itemsPerPage)

        if(!ships){
            res.status(400).json({ message: 'Request could not be processed' })
        }
        
        res.status(200).json({ message: 'Ships found Successfully',pagination:{count,pageCount,itemsPerPage},ships })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}

 

const patchEditShip = async (req,res,next) =>{
    const {shipInfo} = req.body
    const {_id,shipId,status,capacity,model,brand,year } = shipInfo
    const data = {shipId,status,capacity,model,brand,year}
    try {
        const ship = await Ship.update({...data},{where:{shipId:shipId}})
        if(!ship){
            res.status(400).json({ message: 'No Trucks found' })
        }
        res.status(200).json({ message: 'Truck Edited Successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const deleteShip = async (req,res,next) =>{
    const {shipId} = req.params
    const { sub } = req.user
    try {
        if (!shipId) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        const ship = await Ship.destroy({where:{shipId:shipId}})
        if (!ship) {
            res.status(400).json({ message: 'Request could not be processed' })
        }

        res.status(200).json({ message: 'Ship Deleted Successfully' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}


const postCreateShip = async (req,res,next) =>{
    const {shipInfo} = req.body
    
    const {shipId,status,capacity,model,brand,year } = shipInfo
    const data = {shipId,status,capacity,model,brand,year}
    try {
        const ship = await Ship.create({...data})
        if(!ship){
            res.status(400).json({ message: 'No Ships found' })
        }
        await ship.save()
       
        res.status(200).json({ message: 'Ship Added Successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error processing your request' })
    }
}



module.exports = {
    getAllShips,
    patchEditShip,
    deleteShip,
    postCreateShip
}