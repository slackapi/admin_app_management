import { Team } from '../types'
import { addTeamToDB, removeTeamFromDB, getTeamsFromDB } from '../db/teamDB'
const { validationResult } = require('express-validator');

export let addTeam = (req: any, res: any) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    let team: Team = {
        team_id: req.body.team_id,
        team_name: req.body.team_name,
    }

    addTeamToDB(team, res);
}

export let removeTeam = (req: any, res: any) => {

    let team: Team = {
        team_id: req.body.team_id
    }
    removeTeamFromDB(team, res);
}

export let getTeams = (req: any, res: any) => {
    getTeamsFromDB(res);
}

