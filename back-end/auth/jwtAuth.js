require('dotenv').config()
const jwt = require('jsonwebtoken')
const pool = require('../mysql/dbpool')
const refresh = require('./tokenRefresh')

module.exports = authenticateToken = async (req, res, next) => {

    const cookies = req.cookies
    if (cookies['access-token'] == null) return res.sendStatus(401)

    jwt.verify(cookies['access-token'], process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err && !cookies['refresh-token']) return res.sendStatus(403)
        else if (err && cookies['refresh-token']) {
            try {
                user = await refresh(req, res, cookies['refresh-token'])
            }
            catch (err) {
                res.sendStatus(err)
            }
        }
        try {
            req.user = await bringUserType(user)
            next()
        }
        catch (err) {
            res.sendStatus(err)
        }
    });
}

bringUserType = async (user) => {
    let _user = { ...user }
    let query =
        `SELECT type
        FROM users
        WHERE id = ?`

    try {
        let mqRes = await pool.execute(query, [_user.id])
        if (!mqRes[0][0]) throw 403

        _user.type = mqRes[0][0].type
        return _user
    }
    catch (err) {
        console.log(err)
        if (typeof err === 'number')
            throw err
        else
            throw 500

    }
}

