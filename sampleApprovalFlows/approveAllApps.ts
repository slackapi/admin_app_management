//This is not using the DB components of the application or the APIs. You will only need to start the Bolt app: `node bolt/bolt.js`

import { approveRequest } from './bolt/boltApp' //allows for a request to be approved through Bolt

export let newRequest = async (req: any) => { //Bolt calls this function when it receives a new request from Slack
    approvaLogic(req);
}

let approvaLogic = (req: any) => { //Responds to Bolt to approve the Request
    approveRequest(req.app_request.team.id, req.app_request.id);
}