const nodemailer = require('nodemailer');
const fs = require('fs')
const noreply_password = fs.readFileSync('./server/keys/noreply_password').toString()
const domain = fs.readFileSync('./server/hostname').toString() || "codelist.ro"

const transporter = nodemailer.createTransport({
    host: 'mail.codelist.ro',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@codelist.ro',
        pass: noreply_password
    }
});


const sendConfirmationEmail = async (username, recepient, token) => {
    const mailOptions = {
        from: 'noreply@codelist.ro',
        to: recepient,
        subject: `Confirmare cont ${username}`,
        html: `<h3>Bine ai venit pe codelist.ro!</h3><p>Acceseaza link-ul urmator pentru a activa contul ${username}: <a href="https://${domain}/confirmation/${token}">Activeaza</a></p>`
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }

        console.log(info)
    }); 
}


const sendResetPasswordEmail = async (username, recepient, token) => {
    const mailOptions = {
        from: 'noreply@codelist.ro',
        to: recepient,
        subject: `Resetare parola ${username}`,
        html: `<h3>Bine ai revenit pe codelist.ro!</h3><p>Acceseaza link-ul urmator pentru a schimba parola contului ${username}: <a href="https://${domain}/password/${username}/${token}">Schimba parola</a></p>`
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }

        console.log(info)
    }); 
}

module.exports = {sendConfirmationEmail, sendResetPasswordEmail}