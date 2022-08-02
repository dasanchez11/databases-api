const express = require('express');
const router = express.Router();

router.get('/dashboard-data',isAuthenticated,appController.getDashboardData);


module.exports = router;