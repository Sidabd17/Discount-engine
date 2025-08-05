# 🎯 Discount Allocation Engine

This is a **CLI-based tool** that distributes a given *discount kitty* among sales agents fairly, based on their performance, seniority, target achievement, and active clients.  

The tool ensures:
- Configurable allocation logic (via `config.json` or environment variables)
- Proper handling of **min/max discount constraints**
- Meaningful **justifications** for each agent’s discount
- A **summary report** with stats

---

## 🚀 How to Run

### 1. Install Node.js (if not already)
Make sure you have Node.js installed (`>= v14`).

### 2. Project Files
The tool requires the following files:

- **`input.json`** → Contains site kitty and sales agents data  
- **`config.json`** → Contains allocation weights and optional min/max constraints  
- **`output.json`** → (optional) Generated output file with allocations and summary

### 3. Run the CLI
```bash
# Run and print output to console
node index.js input.json

# Run and save output to a file
node index.js input.json output.json

# Run with a custom config file
node index.js input.json output.json config.json

---

📂 File Formats

🔹 input.json
json
Copy
Edit
{
  "siteKitty": 10000,
  "salesAgents": [
    {
      "id": "A1",
      "performanceScore": 80,
      "seniorityMonths": 24,
      "targetAchievedPercent": 90,
      "activeClients": 10
    },
    {
      "id": "A2",
      "performanceScore": 60,
      "seniorityMonths": 12,
      "targetAchievedPercent": 70,
      "activeClients": 6
    }
  ],
  "minPerAgent": 500,
  "maxPerAgent": 5000
}
🔹 config.json
json
Copy
Edit
{
  "weights": {
    "performance": 0.4,
    "seniority": 0.3,
    "target": 0.2,
    "clients": 0.1
  }
}

🔹 output.json (generated)
json
Copy
Edit
{
  "allocations": [
    {
      "id": "A1",
      "assignedDiscount": 6000,
      "justification": "Consistently high performance and long-term contribution"
    },
    {
      "id": "A2",
      "assignedDiscount": 4000,
      "justification": "Strong target achievement and solid client base"
    }
  ],
  "summary": {
    "totalKitty": 10000,
    "totalAllocated": 10000,
    "remainingKitty": 0,
    "averageDiscount": 5000,
    "maxDiscount": 6000,
    "minDiscount": 4000
  }
}

---

⚙️ Logic Breakdown
Normalization

Performance: score / 100

Target Achievement: percent / 100

Seniority: months / maxMonths

Clients: activeClients / maxClients

Weighted Score Calculation

text
Copy
Edit
finalScore = 
    (performanceWeight * normalizedPerformance) +
    (seniorityWeight * normalizedSeniority) +
    (targetWeight * normalizedTarget) +
    (clientsWeight * normalizedClients)
Discount Allocation

Each agent’s share = (agentScore / totalScore) * totalKitty

Apply minPerAgent and maxPerAgent constraints

Adjust remaining kitty and score dynamically as we go

Justification

Identify the top 2 contributing metrics for each agent

Generate a natural sentence like:

"Consistently high performance and long-term contribution"

"Strong target achievement and solid client base"

Summary Report

totalKitty

totalAllocated

remainingKitty (if mismatch due to rounding/constraints)

averageDiscount

maxDiscount

minDiscount

🧾 Assumptions
If minPerAgent or maxPerAgent is not provided in input.json, defaults are applied:

minPerAgent = siteKitty / (2 * numberOfAgents)

maxPerAgent = siteKitty / 2.5

Weights in config.json always sum approximately to 1.0.

Justifications are kept short and based on the top two contributing metrics.

Rounding differences are adjusted so that the total allocation never exceeds siteKitty.

🛠️ How I Solved the Problem
Understanding Requirements

Input data about sales agents

Allocation must be fair & proportional to multiple factors

Constraints (min/max per agent) must be respected

Human-readable justification for every allocation

Step-by-Step Implementation

Normalized all metrics (0–1 scale)

Combined them using weighted scoring (from config.json)

Allocated kitty proportionally

Applied min/max constraints dynamically

Generated output JSON with allocations & justifications

Added a summary block for quick analysis

Enhancements Made

CLI support with input/output/config as arguments

Configurable weights (instead of hardcoded)

Error handling for invalid/missing files

Summary report with statistics

📸 Screenshots / Demo (Optional)
(Add CLI screenshots or JSON output screenshots here if needed)

✅ Conclusion
This project implements a flexible, production-ready discount allocation engine with configurable logic, fairness, and reporting. It can be extended into a web app or integrated into a larger system.

yaml
Copy
Edit

