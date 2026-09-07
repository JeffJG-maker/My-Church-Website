require("dotenv").config();

const connectDatabase = require("./config/database");
const Sermon = require("./models/Sermon");

const sermons = require("./data/sermons.json");

const seedDatabase = async () => {
    try {
        await connectDatabase();

        await Sermon.deleteMany();

        await Sermon.insertMany(sermons);

        console.log("Sermons imported successfully");

        process.exit(0);

    } catch (error) {
        console.error("Error importing sermons:", error);

        process.exit(1);
    }
};

seedDatabase();