const express = require('express');
const router = express.Router();
const appController = require('../controllers/order.controller');
const {isAuthenticated} = require('../middleware/auth.middleware')

router.post('/create-order-sea',isAuthenticated,appController.postCreateOrderSea);
router.delete('/delete-order/:id',isAuthenticated,appController.deleteOrder);
router.patch('/edit-order/:id',isAuthenticated,appController.patchEditOrder);
router.get('/get-client-orders',isAuthenticated,appController.getClientOrder);
router.get('/get-all-orders',isAuthenticated,appController.getAllOrders);



module.exports = router;