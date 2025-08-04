const fs = require("fs");

const data = JSON.parse(fs.readFileSync("input.json" , "utf-8"));
console.log(data);

const maxSeniorityMonths = 0;
const maxActiveClients = 0;

const salesAgents = data.salesAgents;
for(const agent of salesAgents){
    maxSeniorityMonths = Math.max(maxSeniorityMonths, agent.seniorityMonths);
    maxActiveClients = Math.max(maxActiveClients, agent.activeClients);
}

