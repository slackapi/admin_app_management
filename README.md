This sample application is to be used in conjunction with the Slack Admin App Management functionality. Found here: [Managing Apps](http://api.slack.com/admins/managing). The application can be used as a tool when you are building out your own app management application and plugging it into your business systems.

The application is written in TypeScript. The approval logic should be built in `./approvaLogic.ts` to configure it to be specific to your business.

# API Endpoints
## App Entry Points

There are 3 entry points into the application if you use all the available features.

1. Listening for requests from Slack. These will be sent from the Slack platform as events. They will be processed through Bolt which will take care of verifying the requests. By default this process is running on port 4000 and will need to be publicly accessible.
2. The OAuth helper. This would likely only be used once when you are installing your application to a Slack organization. If you do not want to build an OAuth flow or make the calls manually then this can be used. By default this process is running on port 5000 and will need to be publicly accessible.
3. App APIs. These APIs are designed to make it simple to plug approval logic into existing business systems. There is sensitive data potentially exposed via these APIs so they should never be publicly accessible (If you did want to make these public then you would need to handle the auth). By default this process is running on port 3000 and should never be publicly accessible.
## Authentication

`/redirect/oauth`
This is a helper method to get the appropriate token for the app. As long as you register this endpoint with Slack when you create your app you will be given the token needed to run the application after the OAuth flow.

![](https://paper-attachments.dropbox.com/s_9E0D470798294764E8975A4C41FD61607E52F65178389B5CD815124C14CDF258_1565998950956_redirect.png)

## Requests

GET `/get_requests`
This will return the open requests from the DB, not from Slack. To ensure the DB is up to date first run “/pull_requests”.

POST `/pull_requests`
If your app is not listening for incoming request events, you can pull the outstanding requests at an interval of your choosing.  This will pull all open requests for all known teams and put them through the approval flow. When you cannot receive incoming API calls dues to firewall or architecture constraints then this endpoint can be useful.

POST `/remove_request`
To remove a request from the DB. This should only be used in development and unit testing as requests should stay for audit purposes.

    {
            "request_id":"93948435",
             "team_id": "TXXXXXX"
    }

POST `/approve_request`
Approve an outstanding app request. This will update the request status in the DB and also send the approval to Slack.

    {
            "request_id":"93948435",
             "team_id": "TXXXXXX"
    }

POST `/deny_request`
Deny an outstanding request. This will update the request status in the DB and also send the approval to Slack.

    {
            "request_id":"93948435",
             "team_id": "TXXXXXX"
    }

POST `/add_request`
In case requests need to be added from places other than Slack this endpoint can be used. This should only be used during development and unit testing.

    {
        "app_id": "124333563",
        "request_id": "342432423",
        "user_id": "45354534",
        "user_name": "joe",
        "user_email": "email@test.com",
        "team_id": "T5443",
        "scopes": ["users:read", "users:write"],
        "request_message": "This is a test message",
        "approval_status": "pending"
    }


## Teams

GET `/get_teams`
This will return all the teams that the app is aware of. Teams will automatically be captured and saved when a request comes into Slack.

POST `/add_team`
Manually add a team to your org. The app will collect teams also as requests come in but you can also add teams manually if needed.

    {
        "team_id": "TFP5PC6NM",
        "team_name": "Finance"
    }

POST `/remove_team`
Manually remove a team from your org.

    {
        "team_id": "T3245354"
    }


## Applications

GET `/apps`
Returns all configured Slack applications and rules in the DB.

POST `/approve_app`
Configure an app as approved for your org a set of teams.

    {
        "app_id": "113323",
        "app_name": "sfsdfds",
        "is_app_directory_approved": true,
        "approved": true,
        "globally_approved_or_rejected": false,
        "teams_approved": ["T23423", "T23423523"]
    }

POST `/restrict_app`
Configure an app to be restricted for your org or a set of teams.

    {
        "app_id": "1123",
        "app_name": "Name",
        "is_app_directory_approved": true,
        "approved": false,
        "globally_approved_or_rejected": true
    }

POST `/remove_app`
Removes the app and rules from the DB.

    {
        "app_id": "44423456"
    }


## Scopes

GET `/get_scopes`
Returns all scopes and rules from the DB.

POST `/approve_scope`
Configure a scope as approved for your org or set of teams.

    {
        "scope_name": "users:write",
        "description": "Scope desc",
        "approved": true,
        "token_type": "user",
        "globally_approved_or_rejected": false,
        "teams_approved": ["T23432", "T2343423"]
    }


POST `/restrict_scope`
Configure a scope to be restricted for your org or a set of teams.

    {
        "scope_name": "users:write",
        "description": "Scope desc",
        "approved": false,
        "token_type": "user",
        "globally_approved_or_rejected": true
    }

POST `/remove_scope`
Removes the scope and rules from the DB.

    {
        "scope_name": "users:write"
    }

# Usage
## Requirements

Node 10.13 <br>
NPM 6.9 <br>
MongoDB is setup by default although you will need an instance to connect ([Mlab](https://mlab.com) or [Docker](https://www.thepolyglotdeveloper.com/2019/01/getting-started-mongodb-docker-container-deployment/) are helpful).

## Installation Instructions


1. You will need to decide how you are hosting the application.
2. Clone app git@github.com:slackapi/admin_app_management.git.
3. Replace the `uToken`, and `signSecret` found in `bolt/bolt.ts` with those specific to your application. See Authentication above to use the OAuth helper to get the token.
    1. Replace `uri` found in `db/models.ts` with the location of your DB. It should follow this format: `mongodb://user:pass@…`./
4. Run `npm install`
5. Then run  `npm start`

When successfully running you will see in the console:
```
    Listening on port 5000 (/redirect/oauth)
    Listening on port 3000 (Internal APIs)
    Listening on port 4000 (⚡️ Bolt app is running)
    Successfully Connected to DB
```

## Example of how to use the API to manage requests

Let’s say you have an organization with 2 teams, T1, and T2. After reviewing your app policy you decide that any apps can be automatically installed that are approved by Slack and only contain the following scopes: `incoming-webhook`, `chat:write:bot`.

In addition to this you have already reviewed and approved both Jira and Confluence to be installed on any team.


1. Add both approved scopes to the DB calling `/approve_scope` for each:

        {       
        "scope_name": "incoming-webhook",
        "description": "Allows for incomming messages into Slack",
        "approved": true,
        "token_type": "user",
        "globally_approved_or_rejected": true
        }


        {
        "scope_name": "chat:write:bot",
        "description": "The app can send messages to the team",
        "approved": true,
        "token_type": "user",
        "globally_approved_or_rejected": true
        }
2. Add approved apps to the DB calling `approve_app` for each:
        {
        "app_id": "A2RPP3NFR",
        "app_name": "Jira Cloud",
        "is_app_directory_approved": true,
        "approved": true,
        "globally_approved_or_rejected": true
        }   


        {
        "app_id": "AC23SDS77",
        "app_name": "Confluence Cloud",
        "is_app_directory_approved": true,
        "approved": true,
        "globally_approved_or_rejected": true
        }

3. This example is the default example in `./approvalLogic.ts` so you find the code there.
    First the request is ingested and is added to the DB along with the team.
    ```
    export let newRequest = async (req: any) => {
        await addRequestFromSlack(req); //send the request to the DB with a pending status
        await addTeamToDBFromRequest(req); //adds the team to the DB
        getApprovalRulesFromDB(req); //sends the request on to the approval logic
    }
    ```

    Then the DB is queried to gather the scopes and approved apps.
    ```let getApprovalRulesFromDB = async (req: any) => { //get the app and scope rules from the DB
        let approvedApps: string[] = [];
        let apps: any = await getAppsInternal();
        approvedApps = apps.map((object: any) => { //take app array and return only the app ids that are approved globally
            if (object.globally_approved_or_rejected && object.approved) {
                return object.app_id;
            }
            else {
                return "App Not Approved";
            }
        });
        let approvedScopes: string[] = [];
        let scopes: any = await getScopesInternal();
        approvedScopes = scopes.map((object: any) => { //take the scope array and approve only the ones that are approved globally
            if (object.globally_approved_or_rejected && object.approved) {
                return object.scope_name;
            }
            else {
                return "Scope Not Approved";
            }
        });
        approvaLogic(req, approvedApps, approvedScopes)
    }
    ```

    After this the approval is processed.
    ```
    let approvaLogic = (req: any, approvedApps: string[], approvedScopes: string[]) => { //contains the logic on whether to approve a request or not
        if (approvedApps.includes(req.app_request.app.id)) { //app is approved, send approval
            approveRequest(req.app_request.team.id, req.app_request.id);
        }
        else { //check scopes in request against scopes approved
            let scopesApproved: boolean = true;
            req.app_request.scopes.forEach((scope: any) => {
                if (!(approvedScopes.includes(scope.name))) {
                    scopesApproved = false;
                }
            });
            if (scopesApproved) {
                approveRequest(req.app_request.team.id, req.app_request.id);
            }
            else { //request not approved
                createCase(req, "pending");
            }
        }
    }
    ```

4. Try running some requests through the application to see the experience. You can interact with the APIs to see requests and teams being added to the DB.
5. Let’s say a few months later you want to approve Trello to use. There is no need to touch the code, just call `/approve_app` to update the logic.

   ```
        {
        "app_id": "A074YH40Z",
        "app_name": "Trello",
        "is_app_directory_approved": true,
        "approved": true,
        "globally_approved_or_rejected": true
        }
    ```

6. The same is true for any other apps and scopes. To approve/restrict app/scopes, editing the code is not required. They can be updated via the API.


## Examples, simple approval logic without the API and DB

For these examples the application can be started using `npm run boltOnly`. To use these examples or to build on them, replace the contents of approvalLogic.ts with code found in one of the below files.


1. `sampleApprovalFlows/approveAllApps.ts`

    This will approve all apps.

2.  `sampleApprovalFlows/approveAllAppsForCertainTeams.ts`

    This will approve all apps for certain teams.

3.  `sampleApprovalFlows/approveCertainApps.ts`

    This will approve apps specified.

4.  `sampleApprovalFlows/rejectCertainApps.ts`

    This will restrict all apps specified.
