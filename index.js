const fs = require("fs");

const args = process.argv.slice(2);
const inputFile = args[0] || "input.json";  // agar user ne pass nahi kiya toh default
const outputFile = args[1] || null;

const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
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
        performance: 0.4 * agent.performanceScore,
        seniority: 0.3 * agent.seniorityMonths,
        target: 0.2 * agent.targetAchievedPercent,
        clients: 0.1 * agent.activeClients
    };

    // top 2 metrics nikal lo
    const sorted = Object.entries(contributions).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0][0];
    const top2 = sorted[1] ? sorted[1][0] : null;

    const phrases = {
        performance: "high performance",
        seniority: "long-term contribution",
        target: "strong target achievement",
        clients: "solid client base"
    };

    if (top1 && top2) {
        return `Consistently ${phrases[top1]} and ${phrases[top2]}`;
    } else if (top1) {
        return `Consistently ${phrases[top1]}`;
    } else {
        return "Balanced contribution";
    }
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

if (outputFile) {
  fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));
  console.log(`✅ Allocation saved to ${outputFile}`);
} else {
  console.log(JSON.stringify(finalOutput, null, 2));
}


