import { Scope } from '../types';
import { addScopeToDB, removeScopeFromDB, getScopesFromDB } from '../db/scopeDB';
const { validationResult } = require('express-validator');

export let addScope = (req: any, res: any) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const scopeObject: any = {};
    for (const key in req.body) {//scopes can maybe be sent with more metadata, not sure yet. 
        if (req.body.hasOwnProperty(key)) {
            scopeObject[key] = req.body[key]
        }
    }

    addScopeToDB(scopeObject, res);
}

export let removeScope = (req: any, res: any) => {
    let scope: Scope = {
        scope_name: req.body.scope_name
    }
    removeScopeFromDB(scope, res);
}

export let getScopes = (req: any, res: any) => {
    getScopesFromDB(res);
}
export let getScopesInternal = async () => {
    let scopes = await getScopesFromDB();
    return scopes;
}