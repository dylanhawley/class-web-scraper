const AWS = require('aws-sdk');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: 'us-east-1'
});

const scrapeCourses = async (term, courses, account) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Landing page
  await page.goto('https://one.uf.edu/');
  await page.waitForSelector('.login-item:nth-child(2) .login-text');
  await page.click('.login-item:nth-child(2) .login-text');

  // Login form
  await page.waitForSelector('[id=username]');
  await page.type('[id=username]', account.username);
  await page.waitForSelector('[id=password]');
  await page.type('[id=password]', account.password);
  await page.click('[id=submit]');

  // Dashboard page
  await page.waitForSelector('#myscheduleCard .md-primary');
  await page.click('#myscheduleCard .md-primary');

  // Select term
  const termSelector = '.uf-card:nth-child(' + term + ') .md-raised';
  await page.waitForSelector(termSelector);
  await page.click(termSelector);

  // Add Course
  await page.waitForSelector('.add-course-link');
  await page.waitFor(100);
  await page.click('.add-course-link');

  let data = {};
  for (i = 0; i < courses.length; i++) {
    await page.waitFor(1000);
    // Toggle Filter Sidebar
    await page.waitForSelector('#subHeader .md-button')
    await page.click('#subHeader .md-button');
    await page.waitForSelector('#courseCode', { visible: true });

    await page.evaluate(() => {
      document.querySelector('#courseCode').value = '';
    });

    await page.type('#courseCode', courses[i].courseCode);
    await page.keyboard.press('Enter');
    await page.waitFor(1000);

    const results = await page.evaluate(() => {
      let resultCount = document
          .getElementById('totalCount')
          .getElementsByTagName('span')[0]
          .innerHTML.charAt(0);
      return resultCount;
    });
    if (results == '0') {
      return {}
    }

    // Click on expand course arrow
    await page.click('.course-heading i');
    const content = await page.content();
    const $ = cheerio.load(content);
    let sectionList = {};
    $('.list-group .section-tile')
        .each( function (index, element) {
          let classSection = {};
          classSection['classNumber'] = $(element)
              .find('.section-display')
              .text().match(/(\d+)/)[0];
          classSection['openSeats'] = $(element)
              .find('.section-open-seats')
              .text().match(/(\d+)/)[0];
          let deliveryMethod = $(element)
          .find('.list-group:nth-child(3) span')
          .text();
          classSection['deliveryMethod'] = deliveryMethod.replace(/(\r\n|\n|\r)/gm, "");
          sectionList[index] = classSection;
    });
    data[courses[i].courseCode] = sectionList;
  }

  await browser.close();

  return data;
}

const courses = [
  { courseCode: 'ENC3246' },
  { courseCode: 'ACG2021' },
];

schedule.scheduleJob('*/2 * * * *', () => {
  scrapeCourses(3, courses, config.user).then(resp => {
    for (course in resp){
      for (section in resp[course]) {
        if (resp[course][section].openSeats > 0) {
          const msg = course + ' class number ' +
          resp[course][section].classNumber + ' has open seats! ' +
          resp[course][section].deliveryMethod;
  
          // AWS SNS message
          const params = {
            Message: msg,
            PhoneNumber: '+17249948887',
          };
          var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
          publishTextPromise.then(data => {
            console.log("MessageID is " + data.MessageId);
          })
          .catch(err => {
            console.error(err, err.stack);
          });
        }
      }
    }
  })
  .catch(err => {
    console.log(err);
  });
});
