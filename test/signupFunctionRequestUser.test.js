require("dotenv").config({ path: "test/test.env" });
const { json } = require("express");
const superagent = require('superagent');
const Imap = require('imap');
const user1 = superagent.agent();

const domain = 'http://localhost:' + process.env.PORT;
const validPassword = 'password';

let isJson = jsonstr => {
    try {
        let obj = JSON.parse(jsonstr);
        return true;
    } catch (e) {
        return false;
    }
}

const imap = new Imap({
    user: process.env.GMAIL_SENDER,
    password: process.env.GMAIL_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});

test('Test 1: empty email', async () => {
    let res = await user1.post(domain + '/signup').send({ password: validPassword, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Email cannot be empty');
});

test('Test 2: invalid email', async () => {
    let res = await user1.post(domain + '/signup').send({ email: 'invalidEmail', password: validPassword, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid email');
});

test('Test 3: empty firstname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: validPassword, lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Name cannot be empty');
});

test('Test 4: invalid firstname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: validPassword, firstName: 1234, lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid first name');
});

test('Test 5: empty lastname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: validPassword, firstName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Name cannot be empty');
});

test('Test 6: invalid lastname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: validPassword, firstName: "dumyfirstname", lastName: 12345 });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid last name');
});

test('Test 7: empty password', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Password cannot be empty');
});

test('Test 8: invalid password', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: '1234', firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid password');
});

test('Test 9: already used email', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: validPassword, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('This email already exists');
});

test('Test 10: signup to new account', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.GMAIL_SENDER, password: validPassword, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeTruthy();
}, 20000);

test('Test 11: activate new account', async () => {
    let done = false;
    await new Promise(function (resolve, reject) {
        imap.once('ready', () => {
            try {
                imap.openBox('INBOX', false, (err, box) => {
                    if (err) throw err;
                    imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
                        if (err) throw err;
                        if (!results || !results.length) {
                            imap.end();
                            return;
                        }
                        let f = imap.fetch(results, {
                            bodies: ['HEADER.FIELDS (FROM)', 'TEXT'],
                            struct: true
                        });
                        imap.setFlags(results, ['\\Seen'], function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        f.on('message', (msg, seqno) => {
                            msg.on('body', (stream, info) => {
                                let buffer = '', count = 0;
                                stream.on('data', (chunk) => {
                                    count += chunk.length;
                                    buffer += chunk.toString('utf8');
                                });
                                stream.once('end', async () => {
                                    buffer = buffer.replaceAll('=\n', '').replaceAll('=\r', '').replaceAll('\n', '').replaceAll('\r', '');
                                    let re = new RegExp(domain + '/activate/' + process.env.GMAIL_SENDER + '/[0-9A-Za-z]{1,32}');
                                    let match = re.exec(buffer);
                                    if (match) {
                                        let activateLink = match[0];
                                        {
                                            let res = await user1.post(activateLink).send({ password: 'incorrectPwd' });
                                            let text = res.text;
                                            expect(isJson(text)).toBeTruthy();
                                            let obj = JSON.parse(text);
                                            expect(obj.success).toBeFalsy();
                                            expect(obj.reason).toEqual('Incorrect password');
                                        }
                                        {
                                            let res = await user1.post(activateLink).send({ password: validPassword });
                                            let text = res.text;
                                            expect(isJson(text)).toBeTruthy();
                                            let obj = JSON.parse(text);
                                            expect(obj.success).toBeTruthy();
                                            done = true;
                                            resolve();
                                        }
                                    }
                                });
                            });
                        });
                        f.once('error', (err) => {
                            console.log('Fetch error: ' + err);
                        });
                        f.once('end', () => {
                            imap.end();
                        });
                    });
                });
            } catch (e) {
            }
        });

        imap.once('error', (err) => {
            console.log(err);
        });

        imap.connect();
    });
    expect(done).toBeTruthy();
}, 20000);

test("Test 12: Delete account correct", async () => {
    let user2 = superagent.agent();
    let res1 = await user2.post(domain + "/login").send({ email: process.env.GMAIL_SENDER, password: validPassword });
    let text1 = res1.text;
    expect(isJson(text1)).toBeTruthy();
    let obj1 = JSON.parse(text1);
    expect(obj1.success).toBeTruthy();

    let res2 = await user2.post(domain + "/account/delete").send({ password: validPassword });
    let text2 = res2.text;
    expect(isJson(text2)).toBeTruthy();
    let obj2 = JSON.parse(text2);
    expect(obj2.success).toBeTruthy();
});