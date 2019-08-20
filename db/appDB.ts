import { AppModel } from './models';
import { App } from '../types';
import { AppDB } from './models'

export let addAppToDB = (app: App, res: any) => {
    AppModel.findById(app.app_id)
        .then(returnedApp => {
            if (returnedApp) {
                res.send("App already added");
            }
            else {
                app._id = app.app_id;
                const newApp: AppDB = new AppModel(app);
                newApp.save()
                    .then((dbresponse: any) => {
                        res.send(`{"app_added": ${JSON.stringify(app)}`);
                    })
            }
        });
};

export let getAppsFromDB = async (res?: any) => {
    try {
        let apps = await AppModel.find().exec();
        if (res) {
            res.send(apps);
        }
        else {
            return apps;
        }
    } catch (err) {
        return 'error occured';
    }
}

export let removeAppFromDB = (app: App, res: any) => {
    AppModel.findById(app.app_id)
        .then(returnedApp => {
            if (returnedApp) {
                AppModel.remove({ _id: returnedApp._id }, function (err) {
                    if (!err) {
                        res.send("App removed");
                    }
                    else {
                        res.send('error');
                    }
                });
            }
            else {
                res.send("App not found");
            };
        })
}

export let getAppsFromDBAsync = async (res?: any) => {
    try {
        let apps = await AppModel.find().exec();
        if (res) {
            res.send(apps);
        }
        else {
            return apps;
        }
    } catch (err) {
        return 'error occured';
    }
}