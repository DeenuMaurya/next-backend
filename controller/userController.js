const User = require("../models/user");
const { faker } = require("@faker-js/faker");
const crypto = require("crypto");
const zlib = require("zlib");



exports.createDummyUsers = async (req, res) => {
    try {
        console.log("Generating dummy users...", req.body.count);
        const count = Number(req.body.count || 100);

        const operations = [];


        for (let i = 0; i < count; i++) {
            const start = process.hrtime.bigint();
            const hash = crypto
                .pbkdf2Sync(

                    faker.internet.password(),

                    crypto.randomBytes(16),

                    100000,

                    64,

                    "sha512"

                ).toString("hex");
            const largeObject = {
                text: faker.lorem.paragraphs(200),
                metadata: Array.from({ length: 1000 }, () => ({
                    id: faker.string.uuid(),
                    value: faker.lorem.sentence()
                }))

            };
            const compressed = zlib.gzipSync(
                JSON.stringify(largeObject)
            );
            operations.push({

                insertOne: {

                    document: {

                        name: faker.person.fullName(),

                        email: faker.internet.email(),

                        phone: faker.phone.number(),

                        city: faker.location.city(),

                        age: faker.number.int({ min: 18, max: 70 }),

                        createdAt: new Date(),

                        address: {
                            street: faker.location.street(),
                            city: faker.location.city(),
                            state: faker.location.state(),
                            country: faker.location.country(),
                            zip: faker.location.zipCode()
                        },
                        employment: {
                            company: faker.company.name(),
                            department: faker.commerce.department(),
                            designation: faker.person.jobTitle(),
                            salary: faker.number.int({ min: 30000, max: 300000 })
                        },
                        preferences: {
                            language: faker.helpers.arrayElement(["en", "hi", "fr"]),
                            notifications: true,
                            darkMode: faker.datatype.boolean()
                        },
                        orders: Array.from({ length: 50 }, () => ({
                            orderId: faker.string.uuid(),
                            amount: faker.number.float({ min: 10, max: 5000 }),
                            createdAt: faker.date.recent()
                        })),
                        hash: hash,
                        bio: faker.lorem.paragraphs(50),
                        compressedData: compressed.toString("base64")

                    }

                }

            });

            const end = process.hrtime.bigint();

            console.log(
                Number(end - start) / 1e6,
                "ms"

            );

        }

        const result = await User.bulkWrite(operations);


        await User.countDocuments();

        await User.aggregate([

            {

                $group: {

                    _id: "$city",

                    total: { $sum: 1 },

                    avgAge: { $avg: "$age" }

                }

            }

        ]);

        await User.find({

            age: { $gte: 30 }

        }).limit(100);




        res.json({
            success: true,
            inserted: result.insertedCount,

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while inserting users"
        });
    }

};