const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');

const {isAuthenticated} = require('../middleware/auth.middleware')


router.get('/get-all-users',isAuthenticated,userController.getAllClients)
router.patch('/edit-client/:clientId',isAuthenticated,userController.patchEditClient)



module.exports = router;
