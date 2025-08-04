const fs = require("fs");

const data = JSON.parse(fs.readFileSync("input.json", "utf-8"));
const salesAgents = data.salesAgents;
let totalDiscount = data.siteKitty;

// optional min/max config
const minPerAgent = data.minPerAgent || 0.05;
const maxPerAgent = data.maxPerAgent || Infinity;

// step 1: max values nikal lo (normalization ke liye)
let maxSeniorityMonths = 0;
let maxActiveClients = 0;

for (const agent of salesAgents) {
    maxSeniorityMonths = Math.max(maxSeniorityMonths, agent.seniorityMonths);
    maxActiveClients = Math.max(maxActiveClients, agent.activeClients);
}

// step 2: normalize function
const normaliseSalesAgentsData = (agent) => {
    return {
        id: agent.id,
        performanceScore: agent.performanceScore / 100,
        seniorityMonths: agent.seniorityMonths / (maxSeniorityMonths || 1),
        targetAchievedPercent: agent.targetAchievedPercent / 100,
        activeClients: agent.activeClients / (maxActiveClients || 1)
    };
};

const normalisedSalesAgentsDataList = salesAgents.map(agent => normaliseSalesAgentsData(agent));

// step 3: score nikalne ka function
const individualScores = (agent) => {
    const score = 
        0.3 * agent.performanceScore +
        0.3 * agent.seniorityMonths +
        0.2 * agent.targetAchievedPercent +
        0.2 * agent.activeClients;

    return {
        id: agent.id,
        score: Math.round(score * 100) / 100
    };
};

const individualScoresList = normalisedSalesAgentsDataList.map(agent => individualScores(agent));

// step 4: total score nikal lo
let totalScore = 0;
for (const agent of individualScoresList) {
    totalScore += agent.score;
}

// step 5: justification function
const getJustification = (agent) => {
    const contributions = {
        performance: 0.3 * agent.performanceScore,
        seniority: 0.3 * agent.seniorityMonths,
        target: 0.2 * agent.targetAchievedPercent,
        clients: 0.2 * agent.activeClients
    };

    let topMetric = Object.entries(contributions).sort((a, b) => b[1] - a[1])[0][0];

    if (topMetric === "performance") return "High performer";
    if (topMetric === "seniority") return "Long-term loyalty";
    if (topMetric === "target") return "Target achiever";
    if (topMetric === "clients") return "Strong client base";
    return "Balanced contribution";
};

// step 6: discounts allocate karo (simple loop + min/max + adjust totals)
let individualDiscounts = [];
for (const agent of individualScoresList) {
    let rawAlloc = (agent.score / totalScore) * totalDiscount;
    let finalDiscount;

    if (rawAlloc < minPerAgent) {
        finalDiscount = minPerAgent;
    } else if (rawAlloc > maxPerAgent) {
        finalDiscount = maxPerAgent;
    } else {
        finalDiscount = Math.round(rawAlloc);
    }

    // assign kar diya, ab totals update karo
    totalDiscount -= finalDiscount;
    totalScore -= agent.score;

    individualDiscounts.push({
        id: agent.id,
        discount: finalDiscount
    });
}

// step 7: final output
const finalOutput = {
    allocations: individualDiscounts.map(d => {
        const agent = normalisedSalesAgentsDataList.find(a => a.id === d.id);
        return {
            id: d.id,
            assignedDiscount: d.discount,
            justification: getJustification(agent)
        };
    })
};

console.log(JSON.stringify(finalOutput, null, 2));
