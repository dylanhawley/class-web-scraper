# Class Web Scraper

[![Build Status](https://travis-ci.com/dylanhawley/class-web-scraper.svg?branch=master)](https://travis-ci.com/dylanhawley/class-web-scraper)

Node.js powered webscraper that scans ONE.UF for available seats in class sections during registration period. This software was originally not open-sourced, until I received this email:

>The University of Florida has established a mandatory date for all students to enroll in multi-factor authentication: June 22, 2020.

Multi-factor authentication prevents web-scrapers such as this one from logging into web portals on its own behalf. Therefore, this software will become obsolete effective the date mentioned in the email above.

## Setup

Make sure you have [Node.js](https://nodejs.org/en/download/) installed on your computer.

Install all of the node dependencies by running the following command in the main directory

```bash
npm install
```

Create a new file named `config.js` in the main directory. This file will hold all sensitive information such as ONE.UF login information as well as API keys.
The contents of this file should look like the sample below.

```javascript
module.exports = {
    user: {
        username: 'YOUR_EMAIL_HERE', 
        password: 'YOUR_PASSWORD_HERE',
        phone: '+1YOUR_PHONE_NUMBER'
    },
    aws: {
        accessKeyId: 'YOUR_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    }
};
```

## Starting the Server

Start the Node.js program with this command

```bash
npm start
```
