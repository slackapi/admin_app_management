import express = require('express');
import bodyParser = require('body-parser');
const validator = require('./validator');
import { addTeam, removeTeam, getTeams } from './objects/teams'
import { addApp, removeApp, getApps } from './objects/apps'
import { addScope, removeScope, getScopes } from './objects/scopes'
import { addRequest, removeRequest, manuallyApproveRequest, getRequests, manuallyRejectRequest, pullRequestsFromSlack } from './objects/requests'
require('./bolt/boltApp');

const app: express.Application = express();
app.use(bodyParser.json());

app.use(function (error: Error, req: any, res: any, next: any) {
    if (error instanceof SyntaxError) {
        res.send("Bad Payload");
    } else {
        next();
    }
});

const port = 3000

app.post('/add_team', validator.addTeam, addTeam);
app.get('/get_teams', getTeams);
app.post('/remove_team', removeTeam);
app.post('/approve_app', validator.approveApp, addApp);
app.get('/apps', getApps);
app.post('/restrict_app', validator.restrictApp, addApp);
app.post('/remove_app', validator.removeApp, removeApp);
app.post('/approve_scope', validator.approveScope, addScope);
app.get('/get_scopes', getScopes);
app.post('/restrict_scope', validator.rejectScope, addScope);
app.post('/remove_scope', validator.removeScope, removeScope);
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