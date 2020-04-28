const express = require('express');
const router = express.Router();
const handler = require('../handlers/vacations')
const auth = require('../auth/jwtAuth')
// const authAdmin = require('../auth/jwtAuthAdmin')


/* GET vacations listing. */
router.get('/', handler.allVacations);
router.get('/:id', handler.byID);

/* POST vacations listing */
router.post('/:id/add', auth, handler.addVacationToUser)

/* PUT vacations listing */
router.put('/:id/refund', auth, handler.refundVacationFromUser)
router.put('/:id/cancelrefund', auth, handler.cancelRefundVacation)



module.exports = router;
