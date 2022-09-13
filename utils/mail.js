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

    static sendMail(templateName, to, link, cb) {
        let template = Mailer.templates[templateName];
        var mailOptions = {
            from: Mailer.sender,
            to: to,
            subject: template.subject,
            html: template.body.replaceAll("#LINK", link)
        };
        Mailer.transporter.sendMail(mailOptions, cb);
    }
}

module.exports = Mailer;