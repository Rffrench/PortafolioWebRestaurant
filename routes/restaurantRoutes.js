// Rutas Admin
const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

// CRD Reservations
router.get('/reservations', restaurantController.getReservations);
router.post('/reservations', restaurantController.postReservation);
router.get('/reservations/:userId', restaurantController.getReservation);
router.delete('/reservations/:userId', restaurantController.deleteReservation);


module.exports = router;