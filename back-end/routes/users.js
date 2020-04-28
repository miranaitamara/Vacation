const express = require('express');
const router = express.Router();
const handler = require('../handlers/users');
const authAdmin = require('../auth/jwtAuthAdmin');
const auth = require('../auth/jwtAuth');

/* GET users listing. */
router.get('/', authAdmin, handler.users);
router.get('/profile', auth, handler.userProfile);
router.get('/check', auth, handler.logincheck);

/* POST users listing */
router.post('/', handler.registerUser);
router.post('/login', handler.loginUser);

/*DELETE users listing*/
router.delete('/logout', handler.logOut);

module.exports = router;
