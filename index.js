const fs = require("fs");
const {normalizeAgents} = require("./utils/normalize");
const { calculateScores } = require("./utils/scoring");
const { getJustification } = require("./utils/justification");
const {allocateDiscounts} = require("./utils/allocation");
const { generateSummary } = require("./utils/summary");

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

// optional min/max config with safer defaults
const minPerAgent = data.minPerAgent || totalDiscount / (salesAgents.length * 10);
const maxPerAgent = data.maxPerAgent || totalDiscount / 2;

// step 1: max values for normalization
let maxSeniorityMonths = 0;
let maxActiveClients = 0;

for (const agent of salesAgents) {
  maxSeniorityMonths = Math.max(maxSeniorityMonths, agent.seniorityMonths);
  maxActiveClients = Math.max(maxActiveClients, agent.activeClients);
}

// step 2 : get normalized list using normalizeAgents function
const normalizedList = normalizeAgents(salesAgents, maxSeniorityMonths, maxActiveClients);

// step 3 : Calculate scores for each agent
const individualScoresList = calculateScores(normalizedList, weights);

// step 4 : Allocate the sitekitty to each function 
const {individualDiscounts,totalAllocated,totalDiscountRemaining} = allocateDiscounts(individualScoresList, totalDiscount, minPerAgent, maxPerAgent);

// step 5: final output with allocations and summary
const discounts = individualDiscounts.map(a => a.discount);

// step 6 : Generate final output along with brief summary
const finalOutput = {
  allocations: individualDiscounts.map(d => {
    const agent = normalizedList.find(a => a.id === d.id);
    return {
      id: d.id,
      assignedDiscount: d.discount,
      justification: getJustification(agent, weights)
    };
  }),
  summary: generateSummary(data.siteKitty, totalAllocated, totalDiscountRemaining, discounts)
};

if (outputFile) {
  fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));
  console.log(`✅ Allocation saved to ${outputFile}`);
} else {
  console.log(JSON.stringify(finalOutput, null, 2));
}
