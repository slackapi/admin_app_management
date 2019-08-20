import { addRequestFromSlack } from './objects/requests' //adds request to DB
import { addTeamToDBFromRequest } from './db/teamDB' //adds team to DB
import { approveRequest } from './bolt/boltApp' //allows for a request to be approved through Bolt
import { createCase } from './caseCreation'; //sends the request to the case creation shell

let approvedApps = [ //list of apps which all apps are automatically approved
    "A2RPP3NFR", //Jira
    "AC23SDS77", //Confluence
    "A074YH40Z" //Trello
]

export let newRequest = async (req: any) => {
    await addRequestFromSlack(req); //send the request to the DB with a pending status
    await addTeamToDBFromRequest(req); //adds the team to the DB
    approvaLogic(req); //sends the request on to the approval logic
}

let approvaLogic = (req: any) => {
    if (approvedApps.includes(req.app_request.app.id)) {
        approveRequest(req.app_request.team.id, req.app_request.id);
    }
    else {
        createCase(req, "pending");
        console.log("Not approved, case created");
    }
}