// Controlador Restaurante

const sequelize = require('../util/database');
const Reservation = require('../models/reservationsModel'); // must be imported or it wont work


// Reservas
exports.getReservations = (req, res, next) => {
    sequelize.query('CALL getReservations()')
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Reservations Found');
                error.statusCode = 404;
                throw error;
            }
            console.log(rows);
            res.status(200).json({ reservations: rows });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getReservation = (req, res, next) => {
    const userId = req.params.userId; // se obtiene el ID de la URL dinamica /products/:userId
    sequelize.query('CALL getReservation(:p_userId)', { replacements: { p_userId: userId } })
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Reservations Found');
                error.statusCode = 404;
                throw error;
            }
            console.log(rows);
            res.status(200).json({ reservations: rows });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

exports.postReservation = (req, res, next) => {
    const [reservationDate, reservationTime, party, userId] = [req.body.reservationDate, req.body.reservationTime, req.body.party, req.body.userId];

    // Primero se verifica que no exista una reserva activa 
    sequelize.query('CALL getReservation(:p_userId)', { replacements: { p_userId: userId } })
        .then(rows => {
            if (rows.length > 0) {
                const error = new Error('Ya existe una reserva actualmente');
                error.statusCode = 204;
                throw error;
            }


            return sequelize.query('CALL addReservation(:p_reservationDate, :p_reservationTime, :p_party, :p_userId)', { replacements: { p_reservationDate: reservationDate, p_reservationTime: reservationTime, p_party: party, p_userId: userId } })
        })
        .then(result => {
            res.status(201).json({ result: 'Reserva Insertada' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}

exports.deleteReservation = (req, res, next) => {
    const userId = req.params.userId;


    sequelize.query('CALL getReservation(:p_userId)', { replacements: { p_userId: userId } })
        .then(row => {
            if (row.length === 0) {
                const error = new Error('Reserva no encontrada');
                error.statusCode = 404;
                throw error;
            }


            return sequelize.query('CALL cancelReservation(:p_id)', { replacements: { p_id: row[0].id } })
        })
        .then(result => {
            console.log(result);
            res.status(201).json({ resultado: 'Reserva Eliminada' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}






