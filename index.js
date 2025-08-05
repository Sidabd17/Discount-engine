const fs = require("fs");

const args = process.argv.slice(2);
const inputFile = args[0] || "input.json";   // default input.json
const outputFile = args[1] || null;          // optional output.json
const configFile = args[2] || "config.json"; // default config.json

let data, config;

// Read and parse input and config files and handle errors
try {
  data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
} catch (err) {
  console.error(`❌ Error reading/parsing input file: ${inputFile}`);
  process.exit(1);
}

try {
  config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
} catch (err) {
  console.error(`❌ Error reading/parsing config file: ${configFile}`);
  process.exit(1);
}

// Validate required fields
if (!data.siteKitty || !Array.isArray(data.salesAgents)) {
  console.error("❌ Invalid input file: missing siteKitty or salesAgents array");
  process.exit(1);
}

// validate weights in config.json
if (!config.weights) {
  console.error("❌ Invalid config file: missing weights object");
  process.exit(1);
}

const salesAgents = data.salesAgents;
let totalDiscount = data.siteKitty;

const weights = config.weights;

// Assign weights for each metric
const performanceWeight = weights.performance;
const seniorityWeight = weights.seniority;
const targetWeight = weights.target;
const clientsWeight = weights.clients;



// optional min/max config
const minPerAgent = data.minPerAgent || totalDiscount / (salesAgents.length * 2);
const maxPerAgent = data.maxPerAgent || totalDiscount / 2.5;

// step 1: max min values for normalization
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

// step 3 : create a list of normalized sales agents data
const normalisedSalesAgentsDataList = salesAgents.map(agent => normaliseSalesAgentsData(agent));

// step 4: Function to calculate individual scores based on weights 
const individualScores = (agent) => {
    const score = 
        performanceWeight * agent.performanceScore +
        seniorityWeight * agent.seniorityMonths +
        targetWeight * agent.targetAchievedPercent +
        clientsWeight * agent.activeClients;

    return {
        id: agent.id,
        score: Math.round(score * 100) / 100
    };
};

// step 5: calculate individual scores for each agent
const individualScoresList = normalisedSalesAgentsDataList.map(agent => individualScores(agent));

// step 6: Calculate total score
let totalScore = 0;
for (const agent of individualScoresList) {
    totalScore += agent.score;
}

// step 7: justification function
const getJustification = (agent) => {
    const contributions = {
        performance: performanceWeight * agent.performanceScore,
        seniority: seniorityWeight * agent.seniorityMonths,
        target: targetWeight * agent.targetAchievedPercent,
        clients: clientsWeight * agent.activeClients
    };

    // Sort contributions to find top two
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


// step 8: Allocate discounts based on individual scores and total discount and checking min/max constraints
let individualDiscounts = [];
let totalDiscountRemaining = totalDiscount;
let totalAllocated = 0;
for (const agent of individualScoresList) {
    let rawAlloc = (agent.score / totalScore) * totalDiscountRemaining;
    let finalDiscount;

    if (rawAlloc < minPerAgent) {
        finalDiscount = minPerAgent;
    } else if (rawAlloc > maxPerAgent) {
        finalDiscount = maxPerAgent;
    } else {
        finalDiscount = Math.round(rawAlloc);
    }

    // After calculating the final discount, recalculate the remaining discount
    totalDiscountRemaining -= finalDiscount;
    totalScore -= agent.score;
    totalAllocated += finalDiscount;

    individualDiscounts.push({
        id: agent.id,
        discount: finalDiscount
    });
}

const discounts = individualDiscounts.map(a => a.discount);

// step 8: final output with allocations and summary
const finalOutput = {
    allocations: individualDiscounts.map(d => {
        const agent = normalisedSalesAgentsDataList.find(a => a.id === d.id);
        return {
            id: d.id,
            assignedDiscount: d.discount,
            justification: getJustification(agent)
        };
    }),
    summary:{
        totalKitty: data.siteKitty,
        totalAllocated: totalAllocated,
        remainingKitty: totalDiscountRemaining,
        averageDiscount: Math.round(totalAllocated / discounts.length),
        maxDiscount: Math.max(...discounts),
        minDiscount: Math.min(...discounts)
    }
};

if (outputFile) {
  fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));
  console.log(`✅ Allocation saved to ${outputFile}`);
} else {
  console.log(JSON.stringify(finalOutput, null, 2));
}


