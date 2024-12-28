const express = require('express');
const router = express.Router();
const AuditTrail = require('../models/AuditTrail');

// Get all audit logs
router.get('/api/audit-trails', async (req, res) => {
    try {
        const logs = await AuditTrail.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching audit trails:', error);
        res.status(500).json({ message: 'Error fetching audit trails' });
    }
});

module.exports = router;
