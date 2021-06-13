require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

// NOTE -- CHANGE YOUR PASSWORD AND EMAIL ADDRESS IN .env File

async function getTemplateHtml() {
    console.log("Loading template file in memory")

try {
    const htmlFilePath = path.resolve("./samplehtml.html"); // Enter the path of your HTML file here
    return await readFile(htmlFilePath, 'utf8');
} 
catch (err) {
    return Promise.reject("Could not load html template");
}
}

async function generatePdf() {
    let data = {};
    getTemplateHtml().then(async (res) => {
    // Now we have the html code of our template in res object
    // you can check by logging it on console
    // console.log(res)
    console.log("HandelBars in Action !! Stay Calm")
    const template = hb.compile(res, { strict: true });
    // we have compile our code with handlebars
    const result = template(data);
    const html = result;
    // we are using headless mode
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    // We set the page content as the generated html by handlebars
    await page.setContent(html)
    // We use pdf function to generate the pdf in the same folder as this file.
    await page.pdf({ path: 'converted.pdf', format: 'A4' })
    await browser.close();
    console.log("PDF Generated")
    }).catch(err => {
    console.error(err)
});
}
generatePdf();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

let mailOptions = {
    from: 'rs.mahra4546@gmail.com', 
    to: 'rs.mahra4546@gmail.com',
    cc: 'rs.mahra4546@gmail.com',
    bcc: 'rs.mahra4546@gmail.com',
    subject: 'Nodemailer - Test',
    text: 'HEY, I AM JUST SENDING THIS MESSAGE TO TEST MY API',
    attachments : [
        {
            filename : 'converted.PDF' , path: './converted.PDF'
        }
    ]
};

transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return console.log('Error occurs', err);
    }
    else
    return console.log('Email sent!!!');
    
});