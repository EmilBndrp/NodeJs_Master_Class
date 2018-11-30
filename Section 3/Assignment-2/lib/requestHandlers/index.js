const router = {};

router.ping = require('./ping');
router.notFound = require('./notFound');
router.users = require('./users');
router.tokens = require('./tokens').tokens;
router.menu = require('./menu');
router.cart = require('./cart');

module.exports = router;
