const agenda = require("./agenda");
const sendEmailJob = require("../src/jobs/emailJob");

sendEmailJob(agenda);

(async function () {
    await agenda.start();
    console.log("🚀 Agenda worker started...");
    
    agenda.on("fail:send verification email", async (err, job) => {
        
        if (!job.attrs.failCount || job.attrs.failCount < 3) { // Retry up to 3 times
            await job.schedule("in 1 minute").save(); 
        } else {
            console.log("🚫 Max retries reached, not retrying anymore.");
        }
    });

})();
