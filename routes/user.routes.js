const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');

const {isAuthenticated} = require('../middleware/auth.middleware')


router.get('/get-all-users',isAuthenticated,userController.getAllClients)
router.get('/get-all-client-options',isAuthenticated,userController.getClientsOptions)
router.patch('/edit-client/:clientId',isAuthenticated,userController.patchEditClient)



module.exports = router;
