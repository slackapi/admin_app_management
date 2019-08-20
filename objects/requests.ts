import { Request } from '../types';
import { addRequestToDB, removeRequestFromDB, getRequestsFromDB, updateRequest } from '../db/requestDB';
import { pullRequests, approveRequest, rejectRequest } from '../bolt/boltApp'
const { validationResult } = require('express-validator');
import { getTeamIdsFromDB } from '../db/teamDB'

export let addRequest = (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const requestObject: any = {};
    for (const key in req.body) {//requests can be added with a variety of parameters
        if (req.body.hasOwnProperty(key)) {
            requestObject[key] = req.body[key]
        }
    }
    addRequestToDB(requestObject, res);
}

export let removeRequest = (req: any, res: any) => {
    let request: any = {
        request_id: req.body.request_id
    }
    removeRequestFromDB(request, res);
}

export let manuallyApproveRequest = (req: any, res: any) => {
    let request: Request = {
        request_id: req.body.request_id,
        approval_status: "approved"
    }
    updateRequest(request, res);
    approveRequest(req.body.team_id, req.body.request_id);
}

export let manuallyRejectRequest = (req: any, res: any) => {
    let request: Request = {
        request_id: req.body.request_id,
        approval_status: "rejected"
    }
    updateRequest(request, res);
    rejectRequest(req.body.team_id, req.body.request_id);
}

export let getRequests = (req: any, res: any) => {
    getRequestsFromDB(res);
}

export let addRequestFromSlack = async (requestFromSlack: any) => {
    let request: Request = {
        app_id: requestFromSlack.app_request.app.id,
        request_id: requestFromSlack.app_request.id,
        previous_resolution: requestFromSlack.app_request.app.previous_resolution,//ingest object containing a bunch of data
        user_id: requestFromSlack.app_request.user.id,
        user_name: requestFromSlack.app_request.user.name,
        user_email: requestFromSlack.app_request.user.email,
        team_id: requestFromSlack.app_request.team.id,
        scopes: [],
        request_message: requestFromSlack.app_request.message,
        approval_status: "pending",
        _id: requestFromSlack.app_request.id
    }

    requestFromSlack.app_request.scopes.forEach((element: any) => {
        if (request.scopes) {
            request.scopes.push(
                element.name
            )
        }
    });
    await addRequestToDB(request);
}

export let pullRequestsFromSlack = async (req: any, res: any) => {
    //get all teams in DB
    let teamIds: string[] = await getTeamIdsFromDB();

    res.send(`Pulling requests for the following teams: ${teamIds}`);

    teamIds.forEach(async (team: any) => {
        await pullRequests(team);
    });
}
