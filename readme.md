# Server side of EquiSports

The Server is built with NodeJS and ExpressJS. The server primarily listens to the CRUD operation routes and based on the route and method provided by the client side, This server will communicate with Mongodb atlas server and based on the changes users make in the client side, the Server will change it accordingly.

#### key Features:

- Connects with the mongodb URI using enviroment variables.
- Provides clientside with all the products.
- Adds new products that was received by the client side.
- Updates the client side based on the preferences of user.
- Delete a product from the database that was deleted by the user in the UI.
