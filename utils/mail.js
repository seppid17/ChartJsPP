let nodemailer = require('nodemailer');

class Mailer {
    static init(sender, password, subject, template) {
        Mailer.sender = sender;
        Mailer.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender,
                pass: password
            }
        });
        Mailer.subject = subject;
        Mailer.template = template;
    }

    static sendMail(to, link, cb) {
        var mailOptions = {
            from: Mailer.sender,
            to: to,
            subject: Mailer.subject,
            html: Mailer.template.replaceAll("#LINK", link)
        };
        Mailer.transporter.sendMail(mailOptions, cb);
    }
}

module.exports = Mailer;