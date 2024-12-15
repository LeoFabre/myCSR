const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const {diskStorage} = require("multer");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
console.log('documents.js : check if uploads directory exists at ' + uploadDir);
if (!fs.existsSync(uploadDir)) {
    console.log('documents.js : uploads directory does not exist, creating it');
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log('documents.js : uploads directory exists');
}
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({storage});

// POST /api/documents/:id/upload - upload d'un fichier pour une version de document
router.post('/:id/upload', upload.single('file'), async (req, res) => {
    const {id} = req.params;
    const {expirationDate, status} = req.body;
    const filePath = req.file.path;

    try {
        const lastVersion = await prisma.documentVersion.findFirst({
            where: {documentId: id},
            orderBy: {versionNumber: 'desc'},
        });

        const newVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        const documentVersion = await prisma.documentVersion.create({
            data: {
                documentId: id,
                versionNumber: newVersionNumber,
                filePath,
                expirationDate: new Date(expirationDate),
                status,
            },
        });

        res.status(201).json(documentVersion);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error while uploading and creating document version.'});
    }
});

// GET /api/documents/:id/download/:versionId - téléchargement d'une version spécifique
router.get('/:id/download/:versionId', async (req, res) => {
    const {versionId} = req.params;

    try {
        const version = await prisma.documentVersion.findUnique({
            where: {id: versionId},
        });

        if (!version) {
            return res.status(404).json({error: 'Document version not found.'});
        }

        res.download(path.resolve(version.filePath));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error while downloading the file.'});
    }
});

// GET /api/documents - get all documents
router.get('/', async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            include: {
                currentVersion: true,
                documentVersions: true,
                Requirements: true,
                _count: {
                    select: {
                        documentVersions: true
                    }
                },
            },
        });
        if (documents.length === 0) {
            return res.status(404).json({error: 'myCSR : No documents found.'});
        }
        res.json(documents);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'myCSR : Error while getting documents.'});
    }
});

// POST /api/documents - create a new document
router.post('/', async (req, res) => {
    const {name, requirementId} = req.body;
    try {
        const document = await prisma.document.create({
            data: {
                name,
                requirementId,
            },
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({error: 'myCSR : Error while creating document.'});
    }
});

// PUT /api/documents/:id - update a document
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name, requirementId} = req.body;
    try {
        const updatedDocument = await prisma.document.update({
            where: {id},
            data: {name, requirementId},
        });
        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({error: 'myCSR : Error while updating document.'});
    }
});

// DELETE /api/documents/:id - delete a document
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.document.delete({
            where: {id},
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'myCSR : Error while deleting document.'});
    }
});

// POST /api/documents/:id/versions - create a new version for a document
router.post('/:id/versions', async (req, res) => {
    const {id} = req.params;
    const {filePath, expirationDate, status} = req.body;

    try {
        const lastVersion = await prisma.documentVersion.findFirst({
            where: {documentId: id},
            orderBy: {versionNumber: 'desc'},
        });

        const newVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        const documentVersion = await prisma.documentVersion.create({
            data: {
                documentId: id,
                versionNumber: newVersionNumber,
                filePath,
                expirationDate: new Date(expirationDate),
                status,
            },
        });

        await prisma.document.update({
            where: {id},
            data: {
                currentVersionId: documentVersion.id,
            },
        });

        res.status(201).json(documentVersion);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'myCSR : Error while creating document version.'});
    }
});

// DELETE /api/documents/:id/versions/:versionId - delete a docuemnt version
router.delete('/:id/versions/:versionId', async (req, res) => {
    const {id, versionId} = req.params;
    try {
        await prisma.documentVersion.delete({
            where: {id: versionId},
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Error while deleting document.'});
    }
});

// PUT /api/documents/:id/versions/:versionId - update the state of a document version
router.put('/:id/versions/:versionId', async (req, res) => {
    const {id, versionId} = req.params;
    const {status} = req.body;
    try {
        const updatedVersion = await prisma.documentVersion.update({
            where: {id: versionId},
            data: {status},
        });
        res.json(updatedVersion);
    } catch (error) {
        res.status(500).json({error: 'myCSR : Error while updating document version state.'});
    }
});

module.exports = router;
