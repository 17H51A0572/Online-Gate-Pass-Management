const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/getStudent',ctrlUser.getStudents);
// router.post('/postleave',ctrlUser.postleave);
router.post('/postleave',ctrlUser.postleave);
router.get('/leaveRecordOfStudent',jwtHelper.verifyJwtToken,ctrlUser.getLeaves);
router.get('/getAllStudentsLeaveRecords',jwtHelper.verifyJwtToken,ctrlUser.getAllStudentsLeaveRecords);

module.exports = router;