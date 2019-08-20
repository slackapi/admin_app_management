//only checks required values.
const { check } = require('express-validator');

exports.addTeam = [
    check('team_name').isLength({ min: 1 }),
    check('team_id').isLength({ min: 1 })
];

exports.approveApp = [
    check('app_id').isLength({ min: 1 }),
    check('app_name').isLength({ min: 1 }),
    check('is_app_directory_approved').isIn(['true', 'false']),
    check('approved').isIn(['true']),
    check('globally_approved_or_rejected').isIn(['true', 'false']),
];

exports.restrictApp = [
    check('app_id').isLength({ min: 1 }),
    check('app_name').isLength({ min: 1 }),
    check('is_app_directory_approved').isIn(['true', 'false']),
    check('approved').isIn(['false']),
    check('globally_approved_or_rejected').isIn(['true', 'false']),
];

exports.removeApp = [
    check('app_id').isLength({ min: 1 })
];

exports.approveScope = [
    check('scope_name').isLength({ min: 1 }),
    check('description').isLength({ min: 1 }),
    check('token_type').isIn(['bot', 'user', 'admin']),
    check('approved').isIn(['true']),
    check('globally_approved_or_rejected').isIn(['true', 'false']),
];

exports.rejectScope = [
    check('scope_name').isLength({ min: 1 }),
    check('description').isLength({ min: 1 }),
    check('token_type').isIn(['bot', 'user', 'admin']),
    check('approved').isIn(['false']),
    check('globally_approved_or_rejected').isIn(['true', 'false']),
];

exports.removeScope = [
    check('scope_name').isLength({ min: 1 })
];

exports.addRequest = [
    check('app_id').isLength({ min: 1 }),
    check('request_id').isLength({ min: 1 }),
    check('user_id').isLength({ min: 1 }),
    check('user_name').isLength({ min: 1 }),
    check('user_email').isLength({ min: 1 }),
    check('team_id').isLength({ min: 1 }),
    check('scopes').isLength({ min: 1 }),
    check('request_message').isLength({ min: 1 }),
    check('approval_status').isIn(['approved', 'rejected', 'pending'])
];

exports.approveRequest = [
    check('approval_status').isIn(['approved']),
    check('request_id').isLength({ min: 1 })
];

exports.rejectRequest = [
    check('approval_status').isIn(['rejected']),
    check('request_id').isLength({ min: 1 })
];

exports.removeRequest = [
    check('request_id').isLength({ min: 1 })
];
