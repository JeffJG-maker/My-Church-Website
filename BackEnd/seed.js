require("dotenv").config();

const connectDatabase = require("./config/database");
const Sermon = require("./models/Sermon");
const Event = require("./models/Event");

const sermons = require("./data/sermons.json");
const events = require("./data/events.json");

const seedDatabase = async () => {
    try {
        await connectDatabase();

        await Sermon.deleteMany();
        await Event.deleteMany();

        await Sermon.insertMany(sermons);
        await Event.insertMany(events);

        console.log("Sermons and events imported successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error importing database:", error);

        process.exit(1);
    }
};

seedDatabase();