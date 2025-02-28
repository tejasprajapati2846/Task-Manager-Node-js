const Agenda = require("agenda");

const mongoConnectionString = process.env.MONGO_URL || "mongodb://127.0.0.1/task-manager";
const agenda = new Agenda({ db: { address: mongoConnectionString, collection: "jobs" } });

module.exports = agenda;
