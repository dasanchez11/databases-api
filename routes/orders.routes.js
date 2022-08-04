const express = require('express');
const router = express.Router();
const appController = require('../controllers/order.controller');
const {isAuthenticated} = require('../middleware/auth.middleware')

router.post('/create-order',isAuthenticated,appController.postCreateOrderSea);
router.post('/delete-order',isAuthenticated,appController.postDeleteOrder);
router.patch('/edit-order/:id',isAuthenticated,appController.patchEditOrder);
router.get('/get-client-orders',isAuthenticated,appController.getClientOrder);
router.get('/get-all-orders',isAuthenticated,appController.getAllOrders);



module.exports = router;