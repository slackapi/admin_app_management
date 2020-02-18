import express = require('express');
import bodyParser = require('body-parser');

require('dotenv').config();

const authApp: express.Application = express();
authApp.use(bodyParser.json());

authApp.use(function (error: Error, req: any, res: any, next: any) {
    if (error instanceof SyntaxError) {
        res.send("Bad Payload");
    } else {
        next();
    }
});

const port = 5000

authApp.get('/redirect/oauth', function (req, res) {
    const client_id = process.env.SLACK_CLIENT_ID;
    const client_secret = process.env.SLACK_CLIENT_SECRET;
    const code = req.query.code;
    const url = `https://slack.com/api/oauth.v2.access?code=${code}&client_id=${client_id}&client_secret=${client_secret}`
    res.redirect(url);
});


authApp.get('/', function (req, res) {
    res.send('Try adding a specific method to call');
});

authApp.listen(port, () => console.log(`Listening on port ${port} (/redirect/oauth)`));