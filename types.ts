//Teams represent Slack teams within an organization. For example there could be a Global, IT, and Finance team all under one company.
export interface Team {
    team_name?: string;
    team_id: string;
    _id?: string;
}
//Apps are installed against a specific team. For one app to be used accross an entire organization it will need to be approved and installed on each specific team.
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
//Scopes are how Slack grants permission to apps. Each app must request a specific set of scopes during installation. 
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
//When an end user wants to install an app on a team that has not yet been approved they will create a request and send it to thee DB. This will containt the information needed to make a decision on whether to allow the app to be installed or not. 
export interface Request {
    app_id?: string,
    request_id: string,
    previous_resolution?: any,
    user_id?: string,
    user_name?: string,
    user_email?: string,
    team_id?: string,
    scopes?: string[],
    request_message?: string,
    approval_status?: String,
    _id?: string
}
//Below are the types for the request coming from directly from Slack. See Request above for what is stored in the DB. 
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