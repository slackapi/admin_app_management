import express = require('express');
import bodyParser = require('body-parser');
const validator = require('./validator');
import { addTeam, removeTeam, getTeams } from './objects/teams' //Imports the file that contains the team logic.
import { addApp, removeApp, getApps } from './objects/apps' //Imports the file that contains the app logic.
import { addScope, removeScope, getScopes } from './objects/scopes' //Imports the file that contains the scope logic.
import { addRequest, removeRequest, manuallyApproveRequest, getRequests, manuallyRejectRequest, pullRequestsFromSlack } from './objects/requests' //Imnports the file that contains the scope logic.
require('./bolt/boltApp'); //The bolt app file. The Bolt app is what communcicates with Slack. It handles event verification and api calls to the Slack platform.
require('./auth') //This is used for obtainng the token needed to make api call to Slack at an org level. Using this helper is optional but can be useful if you do not have an OAuth flow setup.

const app: express.Application = express();
app.use(bodyParser.json());

//Checks for malformed JSON
app.use(function (error: Error, req: any, res: any, next: any) {
    if (error instanceof SyntaxError) {
        res.send("Bad Payload");
    } else {
        next();
    }
});

//Defines default port to run the APIs from.
const port = 3000

//Team endpoints for app
app.post('/add_team', validator.addTeam, addTeam);
app.get('/get_teams', getTeams);
app.post('/remove_team', removeTeam);

//Endpoints for managing app approvals
app.post('/approve_app', validator.approveApp, addApp);
app.get('/apps', getApps);
app.post('/restrict_app', validator.restrictApp, addApp);
app.post('/remove_app', validator.removeApp, removeApp);

//Enpoints for managing scopes
app.post('/approve_scope', validator.approveScope, addScope);
app.get('/get_scopes', getScopes);
app.post('/restrict_scope', validator.rejectScope, addScope);
app.post('/remove_scope', validator.removeScope, removeScope);

//Endpoints for dealing with requests
app.post('/pull_requests', pullRequestsFromSlack);
app.get('/get_requests', getRequests);
app.post('/remove_request', validator.removeRequest, removeRequest);
app.post('/approve_request', validator.approveRequest, manuallyApproveRequest);
app.post('/deny_request', validator.rejectRequest, manuallyRejectRequest);
app.post('/add_request', validator.addRequest, addRequest);


app.get('/', function (req, res) {
    res.send('Try adding a specific method to call');
});

app.listen(port, () => console.log(`Listening on port ${port} (Internal APIs)`));