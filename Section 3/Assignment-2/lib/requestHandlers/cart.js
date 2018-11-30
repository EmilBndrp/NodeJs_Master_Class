/**
 * Methods:
 * get
 * put
 * delete
 */

const validate = require('../validate');
const { verifyToken } = require('./tokens');
const data = require('../data');
const config = require('../config');

const cartMethod = {};

cartMethod.get = async function getShoppincartFromUser(requestData) {
  // Check that all the required data are filled out
  const { email } = requestData.queryStringObject;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  // Read the cart of the user
  const { cart } = await data.read('users', email);

  return {
    statusCode: config.statusCode.ok,
    payload: cart,
  };
};

cartMethod.put = async function updateItemsToUsersCart(requestData) {
  // Check that all the required data are filled out
  const { email } = requestData.payload;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  // Get the items requested by the user
  const cartItems = requestData.payload.items;

  // Fetch the users data and the newest menu
  const menu = await data.read('menu', config.newestMenu);
  const userData = await data.read('users', email);
  userData.cart = {};

  // Add the items to the cart
  await Promise.all(cartItems.map((cartItem) => {
    return new Promise((resolve, reject) => {
      const { item, isLunchOffer } = cartItem;

      // Check if the item is on the menu
      if (!menu[item]) {
        const err = new Error(`Item nr. ${item} were not found on the menu.`);
        err.statusCode = config.statusCode.badRequest;

        return reject(err);
      }

      // Check if they want lunchoffer on an item that does not have
      if (isLunchOffer && !menu[item].hasLunchOffer) {
        const err = new Error(`Item nr. ${item} does not have lunch offer.`);
        err.statusCode = config.statusCode.badRequest;

        return reject(err);
      }

      cartItem.price = menu[item].price;
      userData.cart[item] = cartItem;

      return resolve();
    });
  }));

  // Update the user with the new userData 
  await data.update('users', email, userData);

  return {
    statusCode: config.statusCode.ok,
  };
};

cartMethod.delete = async function ClearUsersCart(requestData) {
  // Check that all the required data are filled out
  const { email } = requestData.queryStringObject;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  // Get the users data and override the cart with empty object
  const userData = await data.read('users', email);
  userData.cart = {};

  // Update users data
  await data.update('users', email, userData);

  return {
    statusCode: config.statusCode.ok,
  };
};

module.exports = cartMethod;
