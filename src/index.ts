import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

const resend = new Resend(process.env.RESEND_API_KEY);

const main = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('https://console.algora.io/');

  await page.setCookie({
    name: '__Secure-next-auth.session-token',
    value: 'a8c7f684-66c9-4406-95cc-800a564ab263',
    path: '/'
  });

  await page.waitForSelector('td > div > a > .gap-2');
  await page.evaluate(() => {
    window.scrollTo(0, 10000);
  });
  await page.waitForNetworkIdle({ idleTime: 2500 });

  const latestIssue = await page.$eval(
    'td > div > a > div > .font-medium',
    (element) => element.textContent
  );
  const latestDesc = await page.$eval(
    'td > div > a > .gap-2',
    (element) => element.textContent
  );
  const latestLink = await page.$eval('td > div > .w-full', (element) =>
    element.getAttribute('href')
  );

  const lagBounty = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data.json'), 'utf8')
  );

  if (
    JSON.stringify(lagBounty) !==
    JSON.stringify({ issue: latestIssue, desc: latestDesc, link: latestLink })
  ) {
    const latestBounty = {
      issue: latestIssue,
      desc: latestDesc,
      link: latestLink
    };

    fs.writeFileSync(
      path.join(__dirname, '../src/data.json'),
      JSON.stringify(latestBounty)
    );

    const sIssues = await page.$$eval(
      'td > div > a > div > .font-medium',
      (elements) => Array.from(elements).map((element) => element.textContent)
    );

    const sDesc = await page.$$eval('td > div > a > .gap-2', (elements) =>
      Array.from(elements).map((element) => element.textContent)
    );

    const sLinks = await page.$$eval('td > div > .w-full', (elements) =>
      Array.from(elements).map((element) => element.getAttribute('href'))
    );

    const idxTillLastUpdate = sIssues.findIndex((l) => l == lagBounty.issue);

    if (idxTillLastUpdate === -1) {
      console.log('Some error occurred');
    } else {
      const newIssues = sIssues.slice(0, idxTillLastUpdate);
      const newDesc = sDesc.slice(0, idxTillLastUpdate);
      const newLinks = sLinks.slice(0, idxTillLastUpdate);

      console.log('Sending notification for new issues');

      let htmlmes = '<h1>New issues found</h1><br><ol>';
      for (let i = 0; i < newIssues.length; i++) {
        htmlmes += `<li><a href="${newLinks[i]}">${newIssues[i]}</a> > ${newDesc[i]}</li>`;
      }
      htmlmes += `</ol>`;
      // send email notification for new issues
      resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'kunalverma2468@gmail.com',
        subject: 'New Issues Found',
        html: `${htmlmes}`
      });

      let message = 'New issues found\n\n';
      for (let i = 0; i < newIssues.length; i++) {
        message += `${newIssues[i]} > ${newDesc[i]}\n${newLinks[i]}\n\n`;
      }
      // send whatsapp notification for new issues
      // TODO: whatsapp notification not working outside local
      // message.length > 1600
      //   ? (message = message.slice(0, 1590) + "...")
      //   : message;

      // client.messages
      //   .create({
      //     body: `${message}`,
      //     from: "whatsapp:+14155238886",
      //     to: "whatsapp:+918851940254"
      //   })
      //   .then((logmessage) => console.log(logmessage.sid))
      //   .catch((err) => console.log(err));
    }
  } else {
    console.log('No new issues found');
  }

  await browser.close();
};

// main();

setInterval(main, 60000 * 4);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// import { Twilio } from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new Twilio(accountSid, authToken);
