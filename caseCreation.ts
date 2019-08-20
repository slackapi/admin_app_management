//Send to for external case creation

export let createCase = (req: any, approval_status: string) => {
    req.approval_status = approval_status;
    //send to your case system
}