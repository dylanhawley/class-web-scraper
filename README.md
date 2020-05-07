# Class Web Scraper
Scrapes ONE.UF for available classes

## Setup
Make sure you have [Node.js](https://nodejs.org/en/download/) installed on your computer.

Install all of the node dependencies by running the following command in the main directory
```
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
```
npm start
```