import { App } from '../types';
import { addAppToDB, removeAppFromDB, getAppsFromDB } from '../db/appDB';
const { validationResult } = require('express-validator');

export let addApp = (req: any, res: any) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const appObject: any = {};
    for (const key in req.body) {//apps can be added with 3 values or many more values, need to write all to db when received
        if (req.body.hasOwnProperty(key)) {
            appObject[key] = req.body[key]
        }
    }

    addAppToDB(appObject, res);
}

export let removeApp = (req: any, res: any) => {
    let app: App = {
        app_id: req.body.app_id
    }
    removeAppFromDB(app, res);
}

export let getApps = (req: any, res: any) => {
    getAppsFromDB(res);
}

export let getAppsInternal = async () => {
    let apps = await getAppsFromDB();
    return apps;
}

