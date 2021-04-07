# PortafolioWebRestaurant

This microservice handles the main customers functionalities: reservations, orders and payments. GET, POST, PATCH, PUT or DELETE endpoints can be found. It also contains the logic of the menu items. For example, the service can add a new menu item with a POST request including the image. Images are stored on the server with a file path string in the database. When a customer wants to order something, the menu must be loaded so what happens internally is that the menu items images are compressed in a zip file using the archiver package and sent back to the frontend which uncompresses this zip and maps the images to the items of the menu. (see orders images below). Most of the code of this microservice was written by me.

**Please if you want more info about the project refer to PortafolioWeb**
