const router = {};

router.ping = require('./ping');
router.notFound = require('./notFound');
router.users = require('./users');

module.exports = router;
