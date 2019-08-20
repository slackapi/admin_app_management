import { addRequestFromSlack } from './objects/requests' //adds request to DB
import { addTeamToDBFromRequest } from './db/teamDB' //adds team to DB
import { approveRequest } from './bolt/boltApp' //allows for a request to be approved through Bolt
import { createCase } from './caseCreation'; //sends the request to the case creation shell

let teams = [ //list of teams which all apps are automatically approved
    "TFP5PC6NM",
    "T234324",
    "T092782"
]

export let newRequest = async (req: any) => {
    await addRequestFromSlack(req); //send the request to the DB with a pending status
    await addTeamToDBFromRequest(req); //adds the team to the DB
    approvaLogic(req); //sends the request on to the approval logic
}

let approvaLogic = (req: any) => {
    if (teams.includes(req.app_request.team.id)) { //checks to see if the request is for a team in the auto approve array
        approveRequest(req.app_request.team.id, req.app_request.id); //sends the request to Bolt to be approved in Slack
    }
    else { //the team should not have the application auto approved. Send to your ticketing system to deal with request. The request was also added to the DB so you could access it there via the request APIs
        createCase(req, "pending");
        console.log("Not approved, case created");
    }
}