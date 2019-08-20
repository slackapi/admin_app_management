import express = require('express');
import bodyParser = require('body-parser');

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
    const client_id = "" //replace with your client_id
    const client_secret = "" //replace with your client_secret
    const code = req.param("code");
    const url = `https://slack.com/api/oauth.access?code=${code}&client_id=${client_id}&client_secret=${client_secret}`
    res.redirect(url);
});


authApp.get('/', function (req, res) {
    res.send('Try adding a specific method to call');
});

authApp.listen(port, () => console.log(`Listening on port ${port} (/redirect/oauth)`));