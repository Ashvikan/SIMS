const AuditTrail = require('../models/AuditTrail');

async function logAction(action, details, performedBy = 'System') {
    try {
        const log = new AuditTrail({
            action,
            details,
            performedBy,
            timestamp: new Date(),
        });
        await log.save();
        console.log(`Audit Trail Logged: ${action} by ${performedBy}`);
    } catch (error) {
        console.error('Error logging audit trail:', error);
    }
}

module.exports = logAction;
