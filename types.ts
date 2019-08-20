import { domainToASCII } from "url";

export interface Team {
    team_name?: string;
    team_id: string;
    _id?: string;
}

export interface App {
    app_id: string,
    app_name?: string,
    approved?: boolean,
    description?: string,
    help_url?: string,
    privacy_policy?: string,
    app_homepage_url?: string,
    app_directory_url?: string,
    is_app_directory_approved?: boolean,
    is_internal?: boolean,
    additional_info?: string,
    globally_approved_or_rejected?: boolean,
    teams_approved?: string[],
    teams_restricted?: string[],
    _id?: string,
}

export interface Scope {
    scope_name: string,
    description?: string,
    token_type?: string,
    approved?: boolean,
    globally_approved_or_rejected?: boolean,
    teams_approved?: string[],
    teams_restricted?: string[],
    _id?: string,
}

export interface Request {
    app_id?: string,
    request_id: string,
    previous_resolution?: any,//ingest object containing a bunch of data
    user_id?: string,
    user_name?: string,
    user_email?: string,
    team_id?: string,
    scopes?: string[],
    request_message?: string,
    approval_status?: String,
    _id?: string
}

export interface SlackRequest {
    type: string,
    app_request: SlackAppRequest
}

export interface SlackAppRequest {
    date_created: number,
    message: string,
    scopes: any[],
    previous_resolution: any,
    id: string,
    app: SlackApp,
    user: SlackUser,
    team: SlackTeam
}

export interface SlackApp {
    id: string,
    name: string,
    description: string,
    help_url: string,
    privacy_policy_url: string,
    app_homepage_url: string,
    app_directory_url:
    string,
    is_app_directory_approved: boolean,
    is_internal: boolean,
    additional_info: any
}

export interface SlackUser {
    id: string,
    name: string,
    email: string
}

export interface SlackTeam {
    id: string,
    name: string,
    domain: string
}