## Pre-reqs
- Node JS
- MongoDB
- A reverse proxy/tunnel service, such as `ngrok`
- (optional) a GUI to view MongoDB records

## Steps
- Clone repo to your laptop or server
- Create a new Slack application at https://api.slack.com/apps
  - Add scopes: `admin.apps:read` & `admin.apps:write`
  - From the Basic information page, copy the values following values to your `.env` file
      SLACK_CLIENT_ID=Client ID
      SLACK_CLIENT_SECRET=Client Secret
      SLACK_SIGNING_SECRET=Signing Secret
- Let's get the org-wide app management token
  - In two separate terminals:
    - Start the OAuth token helper: `ts-node auth.ts`, it will listen on port 5000 by default
    - Start up your favorite reverse proxy/tunneler, for example: `ngrok http 5000`
  - From your Slack App Config page (https://api.slack.com/apps):
    - On the OAuth & Permssions page, set your Redirect URL to `https://YOUR_UNIQUE_ID.ngrok.io/redirect/oauth`
    - On the Manage Distribution page, "Activate Public Distribution"
    - Install the app:
      - On the Manage Distribution page, click "Add to Slack"
      - Make sure you are installing to an Organization (and not a Workspace)
      - After clicking "Allow", you will be redirected to a page displaying a token which starts with `xoxp-...`
    - Stop the two processes you started (`ts-node auth.ts` and the reverse proxy/tunnel)
- Similar to how you set the `SLACK_CLIENT_ID` and other variables above, set `SLACK_USER_TOKEN` in `.env` to the `xoxp-...` token you received in the previous step
- Set `MONGO_URI` to the full URI (including `mongodb://`) of a Mongo server you have access to

- Finish setup by enabling event subscriptions
  - In two separate terminals:
    - Start the OAuth token helper: `npm start`, it will listen on port 3000 and 4000 by default
    - Start up your favorite reverse proxy/tunneler, for example: `ngrok http 4000`
  - From your Slack App Config page (https://api.slack.com/apps):
    - On the Event Subscriptions page,
      - Turn on Event Subscriptions
      - Set the Request URL to https://YOUR_UNIQUE_ID.ngrok.io/slack/events
      - Under Subscribe to events on behalf of users, subscribe to the `app_requested` event
      - Be sure to click Save Changes

- You should now be able to able to request an app (for example, https://slack.com/apps/A214NCJF2-icanhazdadjoke) and see that the approval request is logged into the database.
  - You can go to http://localhost:3000/get_requests to see a list of pending requests
  - You can issue the following command with curl to approve that request:
      ```
      curl http://localhost:3000/approve_request -d '{"request_id":"REQUEST_ID_HERE","team_id":"TEAM_ID_HERE"}' -H 'Content-Type: application/json'
      ```
  - Refresh http://localhost:3000/get_requests to see that the database has been updated to reflect approved status
  - Try to install the app again and see that when you click "Add to Slack" you are no longer asked to submit a request for approval, you can actually install the app now