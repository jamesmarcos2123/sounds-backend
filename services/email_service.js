const nodemailer = require('nodemailer');
const { getMaxListeners } = require('../models/user');


const sendEmail = async (email, user) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: 'Recuperação de senha',
        to: email,
        subject: 'Recuperação de senha',
        text: "Para trocar de senha entre no link <a>" + process.env.LINK_RECUPERACAO + "/redefinir-senha/" + user.id + "</a>"
    };

    transporter.sendMail(mailOptions, () => {
        console.log("email enviado com sucesso");
    })

}

module.exports = {
    sendEmail
};