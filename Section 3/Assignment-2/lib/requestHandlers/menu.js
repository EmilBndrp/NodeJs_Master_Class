const data = require('../data');
const config = require('../config');

/**
 * @param {Object} requestData
 * @return {Object}
 */
const menuMethod = {};

menuMethod.get = async function getMenu(requestData) {
  const menudata = await data.read('menu', 'menu-21-11-2018');

  return {
    statusCode: config.statusCode.ok,
    payload: menudata,
  };
};


module.exports = menuMethod;
