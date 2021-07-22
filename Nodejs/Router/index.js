const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const codeGenerator = require('../helpers/codeGenerator')
const publicIdGenerator = require('../helpers/publicIdGenerator')
const sendMail = require('../helpers/mail')

const router = express.Router();

const User = require("../Database-models/User");

router.get("/", (req, res) => {
    res.render("index", { title: "Tracking App" });
});

// Register
router.post("/register", async (req, res) => {
    const { name, surname, password, email } = req.body;
    if (!name || !surname || !password || !email) {
        return res.status(400).json({ success: false, code: 400, message: 'Eksik Bilgi Girdiniz..' })
    }
    try {
        let hashPass = await bcrypt.hash(password, 8)
        let publicId = await publicIdGenerator(name)
        try {
            await new User({ name, surname, password: hashPass, email, publicId: publicId, role: 2 }).save()
        } catch (error) {
            return res.status(409).json({ success: false, code: 409, message: "Bu E-mail zaten kullanılıyor." })
        }
        try {
            await sendMail(email, `${newUSER.name} Welcome to The We Tracking`)
            return res.status(201).json({ success: true, code: 201, message: "Kayıt islemi basarıyla tamamlandı." })
        } catch (error) {
            return res.status(400).json({ success: false, message: "Email Gönderilemedi", error })
        }
    } catch (error) {
        res.status(500).json({ success: false, code: 500, message: 'Beklenmedik bir hata oluştu lütfen sonra yeniden deneyiniz..', error })
    }
});


// Login

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, code: 400, message: 'Eksik Bilgi Girdiniz..' })
    let currentUser = await User.findOne({ email });
    if (!currentUser) {
        return res.status(403).json({ success: false, message: 'Kullanıcı Bulunamadı.' })
    }
    const compare = await bcrypt.compare(password, currentUser.password);
    if (compare) {
        const token = jwt.sign({ name: currentUser.name, surname: currentUser.surname, "publicId": currentUser.publicId, role: currentUser.role }, req.app.get("api_secret_key"));
        res.send({ success: true, code: 200, message: "Ok", name: currentUser.name, role: currentUser.role, token });
    } else {
        res.status(401).json({ success: false, message: 'Hatalı Parola' })
    }
})

router.post("/forget", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, code: 400, message: 'Eksik Bilgi Girdiniz..' })
    let resetCode = await codeGenerator(4)
    let currentUser = await User.findOne({ email })
    if (!currentUser) { return res.status(403).json({ success: false, message: 'Email Adresini Kontrol Edin.' }) }
    await User.findOneAndUpdate({ email }, { forgetpassword: resetCode })
    try {
        sendMail(email, "Tracking App Parola Sıfırlama Kodunuz: " + resetCode)
        res.status(200).json({ success: true, message: `Parola Sıfırlama Kodu ${email} adresine Gönderildi.` })
    } catch (error) {
        res.status(500).json({ success: false, message: "Beklenmedik Bir Hata Olustu, Lütfen Sonra Tekrar Deneyiniz." })
    }
})

router.put("/forget", async (req, res) => {
    const { password, resetCode } = req.body;
    if (!password || !resetCode) {
        res.status(401).json({ success: false, message: "Lütfen Tüm Alanları Doldurun." })
    }
    try {
        let newPassword = await bcrypt.hash(password, 8)
        let currentUser = await User.findOneAndUpdate({ forgetpassword: resetCode }, { password: newPassword, forgetpassword: false }, { runValidators: true })
        if (currentUser)
            res.status(200).json({ success: true, message: 'Parolanız Basarıyla Sıfırlandı.' });
        else
            res.status(400).json({ success: false, message: 'Hatalı Sıfırlama Kodu' });
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})



module.exports = router;