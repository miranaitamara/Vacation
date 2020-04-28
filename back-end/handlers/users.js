require('dotenv').config()
const pool = require('../mysql/dbpool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10;

const users = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const id = req.query.id;
    if (req.user.type != 'admin' && id && req.user.id != id) return res.status(403).json(response)

    const userByID = id ? `WHERE u.id = ?` : `ORDER BY u.id ASC`;

    const adminContent = req.user.type === 'admin' ? `, v.id as vacationId,
    v.name as vacationName,
    v.image as vacationImage,
    utv.status as status,
    DATE_FORMAT(utv.status_change_date, '%Y-%m-%d %H:%i') as lastChanged ` : '';

    const query =
        `SELECT u.id as userId, u.type, u.email as userEmail, utv.user_id as vUserId ${adminContent} 
    FROM users u 
    LEFT JOIN users_to_vacations utv 
    ON u.id = utv.user_id 
    LEFT JOIN vacations v 
    ON v.id = utv.vacation_id 
    ${userByID}`


    try {
        let mqRes;
        if (id)
            mqRes = await pool.execute(query, [id])
        else
            mqRes = await pool.execute(query)

        let data = mqRes[0];

        response.data = mapUserData(data);
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

const userProfile = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const id = req.user.id;

    const query =
        `SELECT u.id as userId, u.type, u.email as userEmail, v.id as vacationId,
        utv.id as orderId,
    v.name as vacationName,
    v.image as vacationImage,
    utv.status as status,
    DATE_FORMAT(utv.status_change_date, '%Y-%m-%d %H:%i') as lastChanged 
    FROM users u 
    LEFT JOIN users_to_vacations utv 
    ON u.id = utv.user_id 
    LEFT JOIN vacations v 
    ON v.id = utv.vacation_id 
    WHERE u.id = ?`


    try {
        let mqRes;
        mqRes = await pool.execute(query, [id])

        let data = mqRes[0];

        response.data = mapUserData(data);
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

const registerUser = async (req, res) => {
    let response = {
        success: false,
    }

    let code = 500;

    let user = req.body;

    if (user.email == undefined || user.password == undefined) {
        response.err = 'Bad Parameters';
        code = 400;
        res.status(code).json(response);
    }
    else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

        let query =
            `INSERT INTO users(email, password)
            VALUES (?, ?)`

        try {
            await pool.execute(query, [user.email, user.password])
            response.success = true;
            response.data = 'User created succesfully';
            code = 200;
        }
        catch (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                code = 409;
                response.err = 'Email already exists'
            } else {
                code = 500;
                response.err = 'Please try again later'
            }
        }

        res.status(code).json(response)
    }
}

const loginUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    let user = req.body;

    let query =
        `SELECT * 
        FROM users
        WHERE email = ?`

    let mqRes;
    try {
        mqRes = await pool.execute(query, [user.email])
    }
    catch (err) {
        code = 500;
        response.err = 'Please try again later'
        return res.status(code).json(response)
    }

    let match;
    try {
        match = await bcrypt.compare(user.password, mqRes[0][0].password)
    } catch (error) {
        console.log(error)
    }
    if (match) {
        let user = {
            email: mqRes[0][0].email,
            id: mqRes[0][0].id,
            type: mqRes[0][0].type,
        }
        let accessToken = await generateToken(user);
        let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

        query =
            `INSERT INTO tokens(token)
        VALUES (?)`
        try {
            await pool.execute(query, [refreshToken])
            response.data = user;
            res.cookie('access-token', accessToken, { maxAge: (2147483647), httpOnly: true, sameSite: true });
            res.cookie('refresh-token', refreshToken, { maxAge: (2147483647), httpOnly: true, sameSite: true });
            response.success = true;
            code = 200;
        }
        catch (err) {
            code = 500;
            response.err = 'Please try again later'
        }
    } else {
        code = 401
        response.err = 'Email or password is incorrect'
    }

    res.status(code).json(response)
}



const logOut = async (req, res) => {

    let response = {
        success: false
    };

    const cookies = req.cookies;

    if (!cookies['refresh-token'] && !cookies['access-token'])
        return res.status(400).json(response)

    const query =
        `DELETE
    FROM tokens
    WHERE token = ?`


    try {
        if (cookies['refresh-token'])
            await pool.execute(query, [cookies['refresh-token']])

        response.success = true
        res.clearCookie('refresh-token', { sameSite: true }).clearCookie('access-token', { sameSite: true }).status(200).json(response)
    }
    catch (err) {
        res.status(500).json(response)
    }
}

const logincheck = async (req, res) => {

    const userType = req.user.type
    res.status(200).json({ succes: true, userType: userType })

}

/*Access Token Generation*/
const generateToken = async (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}


/* Map Data For Users*/
const mapUserData = (data) => {
    let users = [];
    data.map(item => {
        let indexUser = users.findIndex(user => user.Id == item.userId);
        if (indexUser == -1) {

            let _user = {
                Id: item.userId,
                Email: item.userEmail,
                userType: item.type
            }
            let _vacation = checkVacation(item);
            if (_vacation != null)
                _user.Vacations = [_vacation]


            users.push(_user)

        } else {
            let _vacation = checkVacation(item);
            if (_vacation != null && users[indexUser].Vacations)
                users[indexUser].Vacations.push(_vacation);
            if (_vacation != null && !users[indexUser].Vacations)
                users[indexUser].Vacations = [_vacation]
        }
    });

    return users
}

/*Check Vacations*/
const checkVacation = (item) => {
    if (item.vacationId == null) return;
    const vacation = { vacationId: item.vacationId, orderId: item.orderId, Name: item.vacationName, Image: item.vacationImage, Status: item.status, lastStatusChange: item.lastChanged }
    return (vacation)
}

module.exports = {
    users,
    registerUser,
    loginUser,
    logOut,
    logincheck,
    userProfile,
}


