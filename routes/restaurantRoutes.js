// Rutas Admin
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // BodyParser for the images needed

const restaurantController = require('../controllers/restaurantController');

// CRD Reservations
router.get('/reservations', restaurantController.getReservations);
router.get('/reservations/today', restaurantController.getTodayReservations);
router.post('/reservations', restaurantController.postReservation);
router.get('/reservations/:userId', restaurantController.getReservation);
router.delete('/reservations/:userId', restaurantController.deleteReservation);


// CRUD Menu
router.get('/menu', restaurantController.getMenuItems);
router.get('/menu/images', restaurantController.getMenuItemsImages);
router.post('/menu', restaurantController.postMenuItem);
router.post('/menu/images', restaurantController.postMenuItemImage); // TODO: mover al admi
// MenuItem Images uploaded separately as multipart/form-data. Data in JSON
router.get('/menu/images/:menuItemId', restaurantController.getMenuItemImage); // lo dinamico :Id al final siempre!
router.get('/menu/:menuItemId', restaurantController.getMenuItem);
router.delete('/menu/:menuItemId', restaurantController.deleteMenuItem);


// Orders
router.get('/orders', restaurantController.getOrders);
router.post('/orders', restaurantController.postOrder);
router.get('/orders/:userId', restaurantController.getOrder);
router.put('/orders/:userId', restaurantController.putOrderExtra);
router.delete('/orders/:orderId', restaurantController.deleteOrder);

module.exports = router;