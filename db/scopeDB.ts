import { ScopeModel } from './models';
import { Scope } from '../types';
import { ScopeDB } from './models'

export let addScopeToDB = (scope: Scope, res: any) => {
    ScopeModel.findById(scope.scope_name)
        .then(returnedScope => {
            if (returnedScope) {
                res.send("Scope already added");
            }
            else {
                scope._id = scope.scope_name;
                const newScope: ScopeDB = new ScopeModel(scope);
                newScope.save()
                    .then((dbresponse: any) => {
                        res.send(`{"Scope_added": ${JSON.stringify(newScope)}`);
                    })
            }
        });
};

export let getScopesFromDB = async (res?: any) => {
    try {
        let scopes = await ScopeModel.find().exec();
        if (res) {
            res.send(scopes);
        }
        else {
            return scopes;
        }
    } catch (err) {
        return 'error occured';
    }
}

export let removeScopeFromDB = (scope: Scope, res: any) => {
    ScopeModel.findById(scope.scope_name)
        .then(returnedScope => {
            if (returnedScope) {
                ScopeModel.remove({ _id: returnedScope._id }, function (err) {
                    if (!err) {
                        res.send("Scope removed");
                    }
                    else {
                        res.send('error');
                    }
                });
            }
            else {
                res.send("Scope not found");
            };
        })
}