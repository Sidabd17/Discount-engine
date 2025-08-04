const fs = require("fs");

const data = JSON.parse(fs.readFileSync("input.json" , "utf-8"));
// console.log(data);

let maxSeniorityMonths = 1;
let maxActiveClients = 1;

const salesAgents = data.salesAgents;
for(const agent of salesAgents){
    maxSeniorityMonths = Math.max(maxSeniorityMonths, agent.seniorityMonths);
    maxActiveClients = Math.max(maxActiveClients, agent.activeClients);
}

console.log("Max Seniority Months:", maxSeniorityMonths);
console.log("Max Active Clients:", maxActiveClients);

const normaliseSalesAgentsData = (agent) =>{
    return {
        id: agent.id,
        performanceScore: agent.performanceScore / 100,
        seniorityMonths: Math.round(agent.seniorityMonths / maxSeniorityMonths * 100) / 100,
        targetAchievedPercent: agent.targetAchievedPercent / 100,
        activeClients: Math.round(agent.activeClients / maxActiveClients * 100) / 100
    };
}

const normalisedSalesAgentsDataList = salesAgents.map(agent=> normaliseSalesAgentsData(agent));
console.log(normalisedSalesAgentsDataList);

const individualScores = (agent) => {
    return {
        id : agent.id,
        score : Math.round((0.4 * agent.performanceScore + 0.3 * agent.seniorityMonths + 0.2 * agent.targetAchievedPercent + 0.1 * agent.activeClients) * 100) / 100
    }
}

const individualScoresList = normalisedSalesAgentsDataList.map(agent => individualScores(agent));
console.log(individualScoresList);

let totalScore = 0;
for(const agent of individualScoresList){
    totalScore += agent.score;
}

const totalDiscount = data.siteKitty ;

const individualDiscounts = individualScoresList.map(agent => {
    return{
        id: agent.id,
        discount: Math.round((agent.score / totalScore) * totalDiscount * 100) / 100
    }
})

console.log(individualDiscounts);
