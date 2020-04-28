const pool = require('../mysql/dbpool')

const allVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, image 
        FROM vacations v
        WHERE v.available
        ORDER BY id ASC`

    try {
        let mqRes = await pool.execute(query)

        response.data = mqRes[0];
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

const byID = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const id = req.params.id

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, image 
        FROM vacations
        WHERE id = ?
        LIMIT 1`

    try {
        let mqRes = await pool.execute(query, [id])

        response.data = mqRes[0];
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}


const addVacationToUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const userID = req.user.id;
    const vacationID = req.params.id;
    const specialID = userID.toString() + '$' + vacationID.toString();

    const query =
        `INSERT INTO users_to_vacations(id, user_id, vacation_id)
        SELECT ?, ?, v.id
        FROM vacations AS v
        WHERE v.id = ? 
        AND v.available`

    try {
        await pool.execute(query, [specialID, userID, vacationID])
        response.success = true;
        response.data = 'Vacation added to user succesfully'
        code = 201;
    }
    catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            code = 409;
            response.err = 'Vacation already assigned to user'
        } else {
            code = 500;
            response.err = 'Please try again later'
        }
    }
    res.status(code).json(response)
}

const refundVacationFromUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const userID = req.user.id;
    const vacationID = req.params.id;
    const specialID = userID.toString() + '$' + vacationID.toString();

    const query =
        `UPDATE users_to_vacations
        SET status= CASE 
            WHEN status='approved' THEN 'pending refund'
            ELSE status
        END
        WHERE id = ?`

    try {
        await pool.execute(query, [specialID])
        response.success = true;
        response.data = 'Refund for vacations has been issued'
        code = 202;
    }
    catch (err) {
        console.log(err)
        code = 500;
        response.err = 'Please try again later'
    }
    res.status(code).json(response)
}

const cancelRefundVacation = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const userID = req.user.id;
    const vacationID = req.params.id;
    const specialID = userID.toString() + '$' + vacationID.toString();

    const query =
        `UPDATE users_to_vacations
        SET status= CASE 
            WHEN status='pending refund' THEN 'approved'
            ELSE status
        END
        WHERE id = ?`

    try {
        await pool.execute(query, [specialID])
        response.success = true;
        response.data = 'Refund for vacations has been cancelled'
        code = 200;
    }
    catch (err) {
        console.log(err)
        code = 500;
        response.err = 'Please try again later'
    }
    res.status(code).json(response)
}

module.exports = {
    allVacations,
    byID,
    addVacationToUser,
    refundVacationFromUser,
    cancelRefundVacation,
}