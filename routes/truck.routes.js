const express = require('express')
const router = express.Router()
const truckController = require('../controllers/truck.controller.js')
const {isAuthenticated} = require('../middleware/auth.middleware')

router.get('/get-all-trucks',isAuthenticated,truckController.getAllTrucks)
router.patch('/edit-truck',isAuthenticated,truckController.patchEditTruck)
router.delete('/delete-truck/:truckId',isAuthenticated,truckController.deleteTruck)
router.post('/create-truck',isAuthenticated,truckController.postCreateTruck)

module.exports = router
