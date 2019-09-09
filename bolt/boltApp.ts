import { App } from '@slack/bolt';
import { WebAPICallResult } from '@slack/web-api';
import { newRequest } from '../approvalLogic';
import { SlackRequest } from '../types';
const uToken = "";//replace with the Slack access token
const signSecret = ""; //replace with the Slack signing secret
const authorizeFn = async () => { //Allows Bolt to be used with only a user token and not a bot token.
    return {
        userToken: uToken,
    }
}
//Initializes your app with your signing secret.
const boltApp = new App({
    signingSecret: signSecret,
    authorize: authorizeFn,
    ignoreSelf: false
});
//Listens for any app requests coming from an organization.
boltApp.event('app_requested', ({ event }) => {
    newRequest(event);
});
//Allows any payload for the app requests. 
interface AdminAppsRequestsListResult extends WebAPICallResult {
    app_requests: any[];
}
//Get all outstanding requests from a team and pass them through the approval flow.
export let pullRequests = async (team: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.requests.list", {
            token: uToken,
            team_id: team,
            limit: 1000
        }) as AdminAppsRequestsListResult;
        result.app_requests.forEach(async (request) => {
            let newAppRequest = { app_request: request }
            await newRequest(newAppRequest);
        });
    }
    catch (error) {
        console.error(error);
    }
}
//Sends a team app approval to Slack for an existing request. 
export let approveRequest = async (team: string, request_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.approve", {
            token: uToken,
            team_id: team,
            limit: 1000,
            request_id
        });
    }
    catch (error) {
        console.error(error);
    }
}
//Sends a team app rejection to Slack for an existing request. 
export let rejectRequest = async (team: string, request_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.restrict", {
            token: uToken,
            team_id: team,
            limit: 1000,
            request_id
        });
    }
    catch (error) {
        console.error(error);
    }
}
//Sends a team app approval to Slack not related to a request. 
export let approveApp = async (team: string, app_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.approve", {
            token: uToken,
            team_id: team,
            limit: 1000,
            app_id
        });
    }
    catch (error) {
        console.error(error);
    }
}
//Restricts an app for a team, not related to a request. 
export let restrictApp = async (team: string, app_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.restrict", {
            token: uToken,
            team_id: team,
            limit: 1000,
            app_id
        });
    }
    catch (error) {
        console.error(error);
    }
}
//Starts the process.
(async () => {
    // Start your app
    await boltApp.start(process.env.PORT || 4000);
    console.log('Listening on port 4000 (⚡️ Bolt app is running');
})();