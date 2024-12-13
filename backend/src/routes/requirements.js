const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// GET /api/requirements - get all requirements
router.get('/', async (req, res) => {
    try {
        const requirements = await prisma.requirement.findMany({
            include: {
                documents: {
                    include: {
                        currentVersion: true,
                    },
                },
            },
        });
        res.json(requirements);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting requirements.' });
    }
});

// GET /api/requirements/:id - get a single requirement by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const requirement = await prisma.requirement.findUnique({
            where: { id },
            include: {
                documents: {
                    include: {
                        currentVersion: true,
                    },
                },
            },
        });
        if (!requirement) {
            return res.status(404).json({ error: 'Requirement not found.' });
        }
        res.json(requirement);
    } catch (error) {
        res.status(500).json({ error: 'Error while getting requested requirement.' });
    }
});

module.exports = router;
