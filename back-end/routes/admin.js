const express = require('express');
const router = express.Router();
const handler = require('../handlers/admin');
const authAdmin = require('../auth/jwtAuthAdmin');
const multer = require('multer');


// Multer "Settings"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true)
    else
        cb({ status: 422, message: 'Wrong file type' }, false)
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


// Admin GET 
router.get('/statistics', authAdmin, handler.getStats)
router.get('/vacations', authAdmin, handler.getVacations)
router.get('/vacations/:id', authAdmin, handler.getVacationsByID )
router.get('/orders', authAdmin, handler.getOrders )

// Admin POST 
router.post('/vacation', authAdmin, upload.single('image'), handler.createVacation);

// Admin PUT
router.put('/vacation/:id', authAdmin, handler.updateVacation)
router.put('/orders/:id/approve', authAdmin, handler.approveOrder)
router.put('/setAdmin/:id', authAdmin, handler.setAdmin)
router.put('/removeAdmin/:id', authAdmin, handler.removeAdmin)

// Admin DELETE
router.delete('/orders/:id/refund', authAdmin, handler.refundOrder)


module.exports = router;