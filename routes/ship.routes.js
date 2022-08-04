const express = require('express')
const router = express.Router()
const shipController = require('../controllers/ship.controller.js')
const {isAuthenticated} = require('../middleware/auth.middleware')

router.get('/get-all-ships',isAuthenticated,shipController.getAllShips)
router.patch('/edit-ship',isAuthenticated,shipController.patchEditShip)
router.delete('/delete-ship/:shipId',isAuthenticated,shipController.deleteShip)
router.post('/create-ship',isAuthenticated,shipController.postCreateShip)

module.exports = router
