import { TeamModel } from './models';
import { Team } from '../types';
import { TeamDB } from './models'

export let addTeamToDB = (team: Team, res?: any) => {
    TeamModel.findById(team.team_id)
        .then(returnedTeam => {
            if (returnedTeam) {
                res.send("Team already added");
            }
            else {
                const newTeam: TeamDB = new TeamModel({
                    team_id: team.team_id,
                    team_name: team.team_name,
                    _id: team.team_id,
                });
                newTeam.save()
                    .then((dbresponse: any) => {
                        console.log(dbresponse);
                        res.send(`{"team_added": ${JSON.stringify(team)}`);
                    })
            }
        });
};

export let getTeamsFromDB = (res: any) => {
    TeamModel.find()
        .then(results => {
            res.send(results);
        });
}

export let getTeamIdsFromDB = async () => {
    let teamIds: string[] = [];
    await TeamModel.find()
        .then((results) => {
            teamIds = results.map((object: any) => {
                return object.team_id;
            });
        });
    return teamIds;
}

export let removeTeamFromDB = (team: Team, res: any) => {
    TeamModel.findById(team.team_id)
        .then(returnedTeam => {
            if (returnedTeam) {
                TeamModel.remove({ _id: returnedTeam._id }, function (err) {
                    if (!err) {
                        res.send("Team removed");
                    }
                    else {
                        res.send('error');
                    }
                });
            }
            else {
                res.send("Team not found");
            };
        })
}

export let addTeamToDBFromRequest = async (request: any) => {
    let team: Team = {
        team_id: request.app_request.team.id,
        team_name: request.app_request.team.name,
        _id: request.app_request.team.id
    }

    await TeamModel.findById(team.team_id)
        .then(async (returnedTeam) => {
            if (returnedTeam) {
            }
            else {
                const newTeam: TeamDB = new TeamModel(team);
                newTeam.save()
                    .then(async (dbresponse: any) => {
                        console.log(`{"team_added": ${JSON.stringify(team)}`);
                    })
            }
        });
};