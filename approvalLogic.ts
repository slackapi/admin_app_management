import { addRequestFromSlack } from './objects/requests' //adds request to DB
import { addTeamToDBFromRequest } from './db/teamDB' //adds team to DB
import { approveRequest, rejectRequest, approveApp, restrictApp } from './bolt/boltApp' //allows for a request to be approved through Bolt
import { createCase } from './caseCreation'; //sends the request to the case creation shell
import { getAppsInternal } from './objects/apps'; //gets all the apps in the DB with rules
import { getScopesInternal } from './objects/scopes'; //gets all the scopes in the DB with rules
import { SlackRequest } from './types';

export let newRequest = async (req: any) => {
    await addRequestFromSlack(req); //send the request to the DB with a pending status
    await addTeamToDBFromRequest(req); //adds the team to the DB
    getApprovalRulesFromDB(req); //sends the request on to the approval logic
}

let getApprovalRulesFromDB = async (req: SlackRequest) => { //get the app and scope rules from the DB
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
    approvedScopes = scopes.map((object: any) => { //take the scope array and approve only the ones that are approced globally
        if (object.globally_approved_or_rejected && object.approved) {
            return object.scope_name;
        }
        else {
            return "Scope Not Approved";
        }
    });
    approvaLogic(req, approvedApps, approvedScopes);
}

let approvaLogic = (req: SlackRequest, approvedApps: string[], approvedScopes: string[]) => { //contains the logic on whether to approve a request or not
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