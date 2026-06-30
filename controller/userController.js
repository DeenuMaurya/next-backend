const User = require("../models/user");
const { faker } = require("@faker-js/faker");

exports.createDummyUsers = async (req, res) => {
    console.log("Generating dummy users...", req.body.count);
    const count = Number(req.body.count || 100);

    const users = [];

    for (let i = 0; i < count; i++) {

        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            city: faker.location.city(),
            age: faker.number.int({ min: 18, max: 70 })
        });

    }

    const result = await User.insertMany(users);

    res.json({
        success: true,
        inserted: result.length
    });

};