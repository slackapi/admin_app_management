import { addRequestFromSlack } from './objects/requests' //adds request to DB
import { addTeamToDBFromRequest } from './db/teamDB' //adds team to DB
import { approveRequest, rejectRequest } from './bolt/boltApp' //allows for a request to be approved through Bolt
import { createCase } from './caseCreation'; //sends the request to the case creation shell

let restrictedApps = [ //list of apps which all apps are automatically approved
    "ADQCR3V6V", //Sample app to auto reject
    "AFPG0BFFH" //Sample app to auto reject
]

export let newRequest = async (req: any) => {
    await addRequestFromSlack(req); //send the request to the DB with a pending status
    await addTeamToDBFromRequest(req); //adds the team to the DB
    approvaLogic(req); //sends the request on to the approval logic
}

let approvaLogic = (req: any) => {
    if (restrictedApps.includes(req.app_request.app.id)) {
        rejectRequest(req.app_request.team.id, req.app_request.id);
    }
    else {
        createCase(req, "pending");
        console.log("Not restricted, case created");
    }
}