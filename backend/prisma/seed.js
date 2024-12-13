const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");
const prisma = new PrismaClient();

async function seedRequirements() {
    const requirements = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream("./Requirements.csv")
            .pipe(csv())
            .on("data", (row) => {
                requirements.push({
                    name: row["Requirement name"],
                    description: row["Requirement description"],
                    documents: row["Documents"].split(", "),
                });
            })
            .on("end", async () => {
                for (const req of requirements) {
                    const requirement = await prisma.requirement.create({
                        data: {
                            name: req.name,
                            description: req.description,
                        },
                    });

                    for (const docName of req.documents) {
                        await prisma.document.create({
                            data: {
                                name: docName,
                                Requirements: {
                                    connect: { id: requirement.id },
                                },
                            },
                        });
                    }
                }
                resolve();
            })
            .on("error", reject);
    });
}

async function seedDocuments() {
    const documents = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream("./Documents.csv")
            .pipe(csv())
            .on("data", (row) => {
                documents.push({
                    name: row["name"],
                    description: row["description"],
                    documentId: row["Document"],
                });
            })
            .on("end", async () => {
                for (const doc of documents) {
                    await prisma.document.updateMany({
                        where: { name: doc.documentId },
                        data: {
                            name: doc.name,
                        },
                    });
                }
                resolve();
            })
            .on("error", reject);
    });
}

async function main() {
    try {
        console.log("Seeding requirements...");
        await seedRequirements();
        console.log("Requirements seeded successfully.");

        console.log("Seeding documents...");
        await seedDocuments();
        console.log("Documents seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
