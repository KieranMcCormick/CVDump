const express = require('express')
const router = express.Router()

router.use(require('./sessions'))
router.use('/comment', require('./comment_api'))
router.use('/files', require('./files_api'))
router.use('/users', require('./users'))
<<<<<<< HEAD
router.use('/notifications',require('./notification_api'))
router.use('/shared', require('./shared_api'))
=======
router.use('/shared', require('./shared_api'))
router.use('/blocks', require('./blocks_api'))
>>>>>>> origin/master

module.exports = router
