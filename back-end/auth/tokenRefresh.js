require('dotenv').config()
const jwt = require('jsonwebtoken')
const pool = require('../mysql/dbpool')

module.exports = tokenRefresh = async (req, res, token) => {
    const query =
        `SELECT * 
    FROM tokens
    WHERE token = ?`
    let _user;

    try {
        let mqRes = await pool.execute(query, [token])
        if (!mqRes[0][0]) throw 403

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            let cookie = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie('access-token', cookie, { maxAge: (2147483647), httpOnly: true, sameSite: true });
            _user = user

        });
        return _user
    }
    catch (err) {
        if (err != 403)
            throw 500
        else
            throw 403
    }
}