import { RequestModel } from './models';
import { Request } from '../types';
import { RequestDB } from './models'

export let addRequestToDB = async (request: Request, res?: any) => {
    await RequestModel.findById(request.request_id)
        .then(async (returnedrequest) => {
            if (returnedrequest) {
                if (res) {
                    res.send("Request already added");
                }
                else {
                    console.log("Request already added");
                }
            }
            else {
                request._id = request.request_id;
                const newRequest: RequestDB = new RequestModel(request);
                newRequest.save()
                    .then(async (dbresponse: any) => {
                        if (res) {
                            console.log("HIT5555555555555555555T");
                            res.send(`{"request_added": ${JSON.stringify(request)}`);
                        }
                        else {
                            console.log(`{"request_added": ${JSON.stringify(request)}`);
                        }
                    })
            }
        });
};

export let getRequestsFromDB = (res: any) => {
    RequestModel.find()
        .then(results => {
            res.send(results);
        });
}

export let removeRequestFromDB = (request: Request, res: any) => {
    RequestModel.findById(request.request_id)
        .then(returnedRequest => {
            if (returnedRequest) {
                RequestModel.remove({ _id: returnedRequest._id }, function (err) {
                    if (!err) {
                        res.send("Request removed");
                    }
                    else {
                        res.send('error');
                    }
                });
            }
            else {
                res.send("Request not found");
            };
        })
}

export let updateRequest = (request: Request, res: any) => {
    RequestModel.findById(request.request_id)
        .then(returnedRequest => {
            if (returnedRequest) {
                RequestModel.update({ _id: returnedRequest._id }, { "approval_status": request.approval_status }, function (err) {
                    if (!err) {
                        res.send("Request Updated"); //need to send to bolt to approve request and then ultimately notify the api caller that the request has been updated in the db and sent to Slack
                    }
                    else {
                        res.send('error');
                    }
                });
            }
            else {
                res.send("Request not found");
            }
        });
};