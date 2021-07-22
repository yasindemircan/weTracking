const express = require('express');
const router = express.Router();
const uniqid = require("uniqid");
const moment = require('moment');

const Activity = require("../Database-models/Activity");



router.post('/activity/new', async (req, res) => {
    const { token, startAddress, finishAddress, waypoints } = req.body;
    try {
        if (!token && !finishAddress && !finishAddress) {
            return res.status(400).json({ success: false, message: 'Eksik Veri Giridiniz.' })
        }

        const findActivity = await Activity.findOne({ creatorId: req.decode.publicId, isActive: true })
        if (findActivity) {
            return res.status(403).json({ success: false, message: 'Zaten Bir Aktivite Mevcut.' })
        }
        new Activity({
            creatorId: req.decode.publicId,
            startAddress: startAddress,
            finishAddress: finishAddress,
            waypoints: waypoints,
            activityId: uniqid(), isActive: true
        }).save()
        res.status(201).json({
            success: true,
            message: 'Ok',
            ActivityInviteCode: req.decode.publicId,
            ActivityInviteLink: `trackingapp://${req.decode.publicId}`
        })

    } catch (err) {
        res.status(400).json({ success: false, message: err })
    }
})
router.put('/activity', async (req, res) => {
    const { token, startAddress, finishAddress, waypoints } = req.body;
    if (token && startAddress && finishAddress) {
        try {
            const ActivityData = await Activity.findOneAndUpdate({ creatorId: req.decode.publicId, isActive: true },
                {
                    startAddress: startAddress,
                    finishAddress: finishAddress,
                    waypoints: waypoints,
                })
            if (ActivityData) {
                res.status(202).send({ success: true, message: 'process successful' })
            } else {
                res.status(404).send({ success: false, message: 'Activity Not found' })
            }

        } catch (error) {
            res.status(500).send({ success: false, message: error })
        }

    }
})
router.post('/activity/complete', async (req, res) => {
    const { token } = req.body;
    if (token) {
        try {
            const ActivityComplete = await Activity.findOneAndUpdate({ creatorId: req.decode.publicId, isActive: true },
                {
                    isActive: false,
                    finishTime: moment().format(),
                })
            if (ActivityComplete) {
                res.status(200).send({ success: true, message: 'Activity completed process successful' })
            } else {
                res.status(404).send({ success: false, message: 'Activity Not found' })
            }
        } catch (error) {
            res.status(500).send({ success: false, message: error })
        }
    }
})

router.post('/activity/history', async (req, res) => {
    const { token } = req.body;
    if (token) {
        try {
            const data = await Activity.find({ creatorId: req.decode.publicId, isActive: false })
            res.status(200).send({ success: true, data: data })
        } catch (error) {
            res.status(500).send({ success: false, error })
        }

    } else {
        res.status(403).send({ success: false, error: "Token Kodu Hatalı" })
    }
})

module.exports = router;