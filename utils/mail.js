let nodemailer = require('nodemailer');

class Mailer {
    static init(sender, password, templates) {
        Mailer.sender = sender;
        Mailer.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender,
                pass: password
            }
        });
        Mailer.templates = templates;
    }

    static sendMail(templateName, to, link, cb = null) {
        let template = Mailer.templates[templateName];
        var mailOptions = {
            from: Mailer.sender,
            to: to,
            subject: template.subject,
            html: template.body.replace(/#LINK/g, link),
            attachments: [{
                filename: 'logo.png',
                path: 'public/images/logo.png',
                cid: 'logo'
            }]
        };
        if (cb == null) { // return a promise
            return Mailer.transporter.sendMail(mailOptions);
        } else { // use the callback
            Mailer.transporter.sendMail(mailOptions, cb);
        }
    }
}

module.exports = Mailer;