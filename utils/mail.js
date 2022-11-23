let nodemailer = require('nodemailer');

/**
 * Sends email with predefined templates
 */
class Mailer {
    /**
     * Initialize the Mailer with email credentials and templates.
     * @param {string} sender email sender's address
     * @param {string} password email sender's password
     * @param {object} templates a key value pairs of email templates
     */
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

    /**
     * Send the email
     * @param {string} templateName name of the template
     * @param {string} to receiver's address
     * @param {string} link link to send
     * @param {Function|undefined} cb callback function to call when mail is sent
     * @returns {Promise|void}
     */
    static sendMail(templateName, to, link, cb = null) {
        // select the template from name
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