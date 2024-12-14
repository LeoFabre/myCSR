const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");
const prisma = new PrismaClient();

async function loadDocuments() {
    const documents = {};

    return new Promise((resolve, reject) => {
        fs.createReadStream("./Documents.csv")
            .pipe(csv())
            .on("data", (row) => {
                documents[row["Document"]] = {
                    name: row["name"],
                    description: row["description"],
                };
            })
            .on("end", () => resolve(documents))
            .on("error", reject);
    });
}

async function seedRequirements() {
    const requirements = [];
    const documents = await loadDocuments(); // Charger les documents avec leurs handles

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

                    for (const docHandle of req.documents) {
                        const docData = documents[docHandle] || { name: "Unknown name", description: "Default description" };

                        await prisma.document.upsert({
                            where: { handle: docHandle },
                            update: {
                                Requirements: {
                                    connect: { id: requirement.id },
                                },
                            },
                            create: {
                                handle: docHandle,
                                name: docData.name,
                                description: docData.description,
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
                    handle: row["Document"],
                    name: row["name"],
                    description: row["description"],
                });
            })
            .on("end", async () => {
                for (const doc of documents) {
                    await prisma.document.upsert({
                        where: { handle: doc.handle },
                        update: {
                            name: doc.name,
                            description: doc.description,
                        },
                        create: {
                            handle: doc.handle,
                            name: doc.name,
                            description: doc.description,
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
