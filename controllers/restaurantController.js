// Controlador Restaurante

const sequelize = require('../util/database');
const Op = require('sequelize').Op; // sequelize operators
const fs = require('fs');
const archiver = require('archiver');
const Reservation = require('../models/reservationsModel'); // must be imported or it wont work
const MenuCategories = require('../models/menuCategoriesModel');
const MenuItems = require('../models/menuItemsModel');
const MenuImages = require('../models/menuImagesModel');
const MenuItemsMenuImages = require('../models/menuItemsMenuImagesModel');
const Orders = require('../models/OrdersModel');
const OrderStatus = require('../models/OrderStatusModel');
const OrderDetails = require('../models/OrderDetailsModel');
const OrderPayments = require('../models/OrderPaymentsModel');
const PaymentTypes = require('../models/PaymentTypesModel');

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
            console.log(JSON.stringify(rows));
            res.status(200).json({ reservations: rows });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

// MYSQL TIMEZONE MUST BE UPDATED!!!!!
exports.postReservation = (req, res, next) => {
    const [reservationDate, reservationTime, party, userId] = [req.body.reservationDate, req.body.reservationTime, req.body.party, req.body.userId];

    // Primero se verifica que no exista una reserva activa 
    sequelize.query('CALL getReservation(:p_userId)', { replacements: { p_userId: userId } })
        .then(rows => {
            if (rows.length > 0) {
                const error = new Error('Ya existe una reserva actualmente');
                error.statusCode = 409; // If i set a 204 or 3xx then it would not work and the server would return a 500. CAREFUL!!! Only 4xx codes apparently work
                error.statusMessage = 'Ya existe una reserva actualmente'
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

// MYSQL TIMEZONE MUST BE UPDATED!!!!!
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
            res.status(204).json({ resultado: 'Reserva Eliminada' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}








// Menu
exports.getMenuItems = (req, res, next) => {
    sequelize.query('CALL getMenuItems()')
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Menu Items Found');
                error.statusCode = 404;
                throw error;
            }
            console.log(rows);
            res.status(200).json({ menu: rows });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

// Mandando zip de imagenes
exports.getMenuItemsImages = (req, res, next) => {
    sequelize.query('CALL getMenuItemsImages()')
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Menu Item Image Found');
                error.statusCode = 404;
                throw error;
            }

            // Se setean los headers para enviar el zip
            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="menuItemsImages.zip"'
            })

            // Creando archivo .zip para las imagenes del menu
            const output = fs.createWriteStream('menuItemsImages.zip', { flags: 'w' });
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            })

            output.on('end', function () {
                console.log('Data has been drained');

            });

            archive.on('error', function (err) {
                throw err;
            });

            // listen for all archive data to be written. 'close' event is fired only when a file descriptor is involved
            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');


                res.status(200).sendFile('menuItemsImages.zip', { root: '.' }); // se manda la rspsta cuando finaliza el proceso de compresion
            });

            archive.pipe(output);

            rows.forEach((row, index) => {
                console.log(row);
                archive.append(fs.createReadStream(row.imagePath), { name: row.menuImageId + '-' + row.imagePath.split('/')[1] }); // Images names are added with the id prepend to then in the fornt identify and link each one with the JSON data. Also the image path is split because otherwise a folder would be created each time with the string 'images'

                //stream.write(`${row.imagePath}\n`);
            })

            // finalize the archive (ie we are done appending files but streams have to finish yet)
            // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
            archive.finalize(); // esto llama a los otros handlers como 'close'

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.getMenuItem = (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    sequelize.query('CALL getMenuItem(:p_id)', { replacements: { p_id: menuItemId } })
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Menu Item Found');
                error.statusCode = 404;
                throw error;
            }
            console.log(rows);
            res.status(200).json(rows);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

// se obtiene aparte la img ya que como JSON no se puede
exports.getMenuItemImage = (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    sequelize.query('CALL getMenuItemImage(:p_menuItemId)', { replacements: { p_menuItemId: menuItemId } })
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Menu Item Image Found');
                error.statusCode = 404;
                throw error;
            }

            console.log(rows[0]);

            res.status(200).sendFile(rows[0].imagePath, { root: '.' }); // se manda la foto como archivo

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

// Middleware para subir la imagen por separado!! No se puede mandar por JSON asique se sube separada como multipart/form-data y se guarda en una tabla el path. La imagen se guardar en el servidor por temas de performance y lo que se guarda es la ruta
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
exports.postMenuItemImage = (req, res, next) => {
    const image = req.file; // no es req.body!! req.file pq es un archivo que adjunta multer, multer se encarga de lo otro
    console.log(req.file);


    MenuImages.findOne({ where: { imagePath: image.path } })
        .then(rows => {
            if (rows) {
                const error = new Error('Ya existe una imagen con ese nombre');
                error.statusCode = 409; // If i set a 204 or 3xx then it would not work and the server would return a 500. CAREFUL!!! Only 4xx codes apparently work
                error.statusMessage = 'Ya existe una imagen con ese nombre'
                throw error;
            }

            return MenuImages.create({ imagePath: image.path })

        })
        .then(newRow => {

            res.status(201).json(newRow.toJSON()); // Se devuelve info de la fila insertada, mas RESTful
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

// La imagen se sube por separada porque no se puede por JSON. EL id de la img se pasa luego a este POST
exports.postMenuItem = (req, res, next) => {
    const [itemName, description, price, isAvailable, categoryId, imageId] = [req.body.name, req.body.description, req.body.price, req.body.isAvailable, req.body.categoryId, req.body.imageId];


    // Primero se verifica que no exista el item
    MenuItems.findOne({ where: { name: itemName } }) // usando sequelize aca
        .then(rows => {
            if (rows) {
                const error = new Error('Ya existe un item con ese nombre');
                error.statusCode = 409; // If i set a 204 or 3xx then it would not work and the server would return a 500. CAREFUL!!! Only 4xx codes apparently work
                error.statusMessage = 'Ya existe un item con ese nombre'
                throw error;
            }

            // START TRANSACTION y COMMIT van en el SP, en caso de error se hace rollback a todo
            return sequelize.query('CALL addMenuItem(:p_name, :p_description, :p_price, :p_isAvailable, :p_categoryId, :p_menuImageId)', { replacements: { p_name: itemName, p_description: description, p_price: price, p_isAvailable: isAvailable, p_categoryId: categoryId, p_menuImageId: imageId } })
        })
        .then(newRow => {
            res.status(201).json({ result: 'Insertado' }); // TODO: cambiar a que me devuelva el item
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteMenuItem = (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    let imagePath;

    sequelize.query('CALL getMenuItem(:p_id)', { replacements: { p_id: menuItemId } })
        .then(row => {
            if (row.length === 0) {
                const error = new Error('Item no encontrado');
                error.statusCode = 404;
                throw error;
            }

            // se va a buscar la foto para sacar el path
            return sequelize.query('CALL getMenuItemImage(:p_menuItemId)', { replacements: { p_menuItemId: menuItemId } })
        })
        .then(row => {
            if (row.length === 0) {
                const error = new Error('No Menu Item Image Found');
                error.statusCode = 404;
                throw error;
            }
            imagePath = row[0].imagePath; // se guarda el path de la foto para borrarla

            // se elimina el path de la img y la img del server
            return sequelize.query('CALL deleteMenuItem(:p_id)', { replacements: { p_id: menuItemId } })
        })
        .then(result => {
            fs.unlink(imagePath, (err) => { // borrando del fs la img
                if (err) {
                    throw err;
                }
                console.log("Imagen Eliminada.");
            });


            res.status(204).json({ resultado: 'Item Eliminado' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}








// Orders
exports.getOrders = (req, res, next) => {
    Orders.findAll()
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Orders Found');
                error.statusCode = 404;
                throw error;
            }
            console.log(rows);
            res.status(200).json(rows.toJSON());
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getOrder = (req, res, next) => {
    const userId = req.params.userId; // se obtiene el ID de la URL dinamica /products/:userId
    Orders.findOne({ where: { customerId: userId } })
        .then(rows => {
            if (rows.length === 0) {
                const error = new Error('No Orders Found');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(rows.toJSON());
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


exports.postOrder = (req, res, next) => {
    const userId = req.body.userId;
    const order = req.body.order;

    console.log(order);


    // Checking if order is empty. It firsts checks if it is null, then it checks if all the items (every()) have qty less or equal 0. If one returns false then it continues to the sequelize part
    if (!order || order.every((item) => {
        return item[1] <= 0; // if its false it means there is at least 1 item with qty > 0
    })) {
        const error = new Error('Orden vacía');
        error.statusCode = 422;
        error.statusMessage = 'Orden Vacía';
        throw error;
    }


    // Primero se verifica que no exista una orden activa i.e que el statusId !=3
    Orders.findOne({ where: { customerId: userId, statusId: { [Op.ne]: 3 } } })
        .then(rows => {
            if (rows) {
                const error = new Error('Ya existe una order en progreso');
                error.statusCode = 409; // If i set a 204 or 3xx then it would not work and the server would return a 500. CAREFUL!!! Only 4xx codes apparently work
                error.statusMessage = 'Ya existe una orden en progreso'
                throw error;
            }


            return Orders.create({ customerId: userId, statusId: 1 }); // first order is created
        })
        .then(newOrder => {
            //now details are inserted (prods and qty)

            let orderInserts = []; // an array of sequelize create promises is created
            order.forEach(item => {
                if (item[1] > 0) { // if the qty is 0 this is not added
                    orderInserts.push(OrderDetails.create({ menuItemId: item[0], orderId: newOrder.id, quantity: item[1] }))
                }
            });

            return [Promise.all(orderInserts), newOrder]; // This array of promises is executed and the new order info is returned

            //newOrder.addMenuItems(MenuItems, { through: { quantity: 2 } })
        })
        .then(([orderInserts, newOrder]) => {
            res.status(201).json(newOrder.toJSON()); // New order info is sent
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.putOrder = (req, res, next) => {
    const userId = req.params.userId;
}


exports.deleteOrder = (req, res, next) => {
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
            res.status(204).json({ resultado: 'Reserva Eliminada' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}



