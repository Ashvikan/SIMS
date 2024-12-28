const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "Order Created", "Stock Updated"
    details: { type: Object, required: true }, // Store contextual data (e.g., productId, orderId)
    performedBy: { type: String, default: 'System' }, // Admin or System
    timestamp: { type: Date, default: Date.now }, // Time of the action
});

module.exports = mongoose.model('AuditTrail', auditTrailSchema);
