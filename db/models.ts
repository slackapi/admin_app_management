import { Document, Schema, Model, model } from "mongoose";
import mongoose from "mongoose";
import { Team } from '../types';
import { App } from '../types';
import { Scope } from '../types';
import { Request } from '../types';

require('dotenv').config();

const uri: string = process.env.MONGO_URI || "";

mongoose.connect(uri, { useNewUrlParser: true }, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected to DB");
    }
});


//Team model
export type TeamDB = Team & Document;

let teamSchema: Schema = new Schema({
    team_name: String,
    team_id: {
        type: String,
        required: [true, 'Team Id is Required']
    },
    _id: String
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

export const TeamModel: Model<TeamDB> = model<TeamDB>("Team", teamSchema);


//App model
export type AppDB = App & Document;

let appSchema: Schema = new Schema({
    app_id: {
        type: String,
        required: [true, 'App Id is Required']
    },
    app_name: String,
    description: String,
    help_url: String,
    privacy_policy: String,
    app_homepage_url: String,
    app_directory_url: String,
    is_app_directory_approved: {
        type: Boolean,
        required: [true, 'is_app_directory_approved is required']
    },
    approved: {
        type: Boolean,
        required: [true, 'approved is required']
    },
    is_internal: Boolean,
    additional_info: String,
    globally_approved_or_rejected: Boolean,
    teams_approved: Array,
    teams_restricted: Array,
    _id: String
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

export const AppModel: Model<AppDB> = model<AppDB>("App", appSchema);


//scope model
export type ScopeDB = Scope & Document;

let scopeSchema: Schema = new Schema({
    scope_name: {
        type: String,
        required: [true, 'Scope is Required']
    },
    description: String,
    token_type: String,
    approved: Boolean,
    globally_approved_or_rejected: Boolean,
    teams_approved: Array,
    teams_restricted: Array,
    _id: String
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

export const ScopeModel: Model<ScopeDB> = model<ScopeDB>("Scope", scopeSchema);


//request model 
export type RequestDB = Request & Document;

let requestSchema: Schema = new Schema({
    app_id: String,
    request_id: String,
    previous_resolution: String,//ingest object containing a bunch of data
    user_id: String,
    user_name: String,
    user_email: String,
    team_id: String,
    scopes: Array,
    request_message: String,
    approval_status: {
        type: String,
        required: [true, 'Scope is Required']
    },
    _id: String
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

export const RequestModel: Model<RequestDB> = model<RequestDB>("Request", requestSchema);