# 🎯 Discount Allocation Engine

This is a **⚡ CLI-based tool** that distributes a given *discount kitty* among sales agents fairly, based on their **performance**, **seniority**, **target achievement**, and **active clients**.  

✨ The tool ensures:
- ⚙️ Configurable allocation logic (via `config.json` or environment variables)  
- 🚧 Proper handling of **min/max discount constraints**  
- 📝 Meaningful **justifications** for each agent’s discount  
- 📊 A **summary report** with key statistics  

---

## 🚀 How to Run

### 1️⃣ Install Node.js  
Make sure you have Node.js installed (`>= v14`).  
👉 [Download Node.js](https://nodejs.org)

### 2️⃣ Install Dependencies
Clone the repo and run:

```
npm install

```
This will install all required dependencies (like jest for testing).

### 3️⃣ Project Files
The tool requires the following files:

- 📥 **input.json** → Contains site kitty and sales agents data  
- ⚙️ **config.json** → Contains allocation weights and optional min/max constraints  
- 📤 **output.json** → (optional) Generated output file with allocations and summary  

ℹ️ **Note**: These files are already included in the project, but you can also provide your own files with the **same structure** if needed.


### 3️⃣ Run the CLI

```bash
# ▶️ Run and print output to console
node index.js input.json

# 💾 Run and save output to a file
node index.js input.json output.json

# ⚙️ Run with a custom config file
node index.js input.json output.json config.json

```
---

## 🗂️ Project Structure

To keep the project **clean**, **scalable**, and **maintainable**, a **modular architecture** has been used.  
All core functionalities are separated into utility files (`/utils`) to ensure better organization and ease of testing.

Here’s the overall folder structure:

```
discount-engine/
│
├── index.js          # Main CLI entry point
├── config.json       # Configurable weights and optional constraints
├── input.json        # Input data for siteKitty & sales agents
├── output.json       # (Generated) Final result with allocations & summary
├── package.json      # Project metadata and script entry
├── Readme.md         # Documentation for understanding and running the project
│
├── utils/                  # Contains modularized logic for each step
│ ├── normalize.js          # Normalizes agent data (0-1 scale)
│ ├── scoring.js            # Calculates weighted score based on config
│ ├── allocation.js         # Handles min allocation + proportional distribution + max capping
│ ├── justification.js      # Creates natural language justification for each agent
│ ├── summary.js            # Generates final summary stats (total, avg, min, max)


```

### 💡 Why Modularization?

- ✅ **Easy to Test & Debug**  
  Each function (scoring, normalization, etc.) is isolated for better testing.

- ✅ **Improved Readability**  
  `index.js` becomes a clean entry point instead of handling everything.

- ✅ **Future-Proof**  
  Easy to extend with new features like unit testing, logging, database integration, or a web UI.

- ✅ **Separation of Concerns**  
  Each utility file handles only one responsibility — a core principle of good software design.

---

## 📂 File Formats

📥 input.json
```
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
      "targetAchievedPercent": 85,
      "activeClients": 6
    },
    {
      "id": "A3",
      "performanceScore": 90,
      "seniorityMonths": 16,
      "targetAchievedPercent": 80,
      "activeClients": 10
    },
    {
      "id": "A4",
      "performanceScore": 85,
      "seniorityMonths": 10,
      "targetAchievedPercent": 75,
      "activeClients": 12
    }
  ],
  "minPerAgent": 250,
  "maxPerAgent": 2000
}
```
⚙️ config.json
```
{
  "weights": {
    "performance": 0.4,
    "seniority": 0.3,
    "target": 0.2,
    "clients": 0.1
  }
}
```

📤 output.json (generated)
```
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
```
---

## ⚙️ Logic Breakdown
### 🔹 Normalization

Before comparing sales agents fairly, we normalize all metrics to a scale of 0–1.
This helps bring different units (like months, %, client count) to a common scale.

```
Performance: score / 100                     # Convert to scale of 0–1
Target Achievement: percent / 100            # Convert to scale of 0–1
Seniority: months / maxMonths among agents   # Relative seniority
Clients: activeClients / maxClients          # Relative client base

```

### 🔹 Weighted Score Calculation

Once normalized, each metric is multiplied with its weight (from config.json) to calculate an agent's final score.
This score reflects how deserving they are of the discount kitty.

```
finalScore = 
    (performanceWeight * normalizedPerformance) +
    (seniorityWeight * normalizedSeniority) +
    (targetWeight * normalizedTarget) +
    (clientsWeight * normalizedClients)
```

### 🔹 Discount Allocation

1. **Minimum Guarantee Allocation**  
   - Each agent is first assigned the `minPerAgent`.  
   - If `siteKitty < minPerAgent * numberOfAgents` → allocation is invalid (error thrown).  

2. **Remaining Kitty Distribution**  
   - The remaining kitty (`siteKitty - (minPerAgent * numberOfAgents)`) is distributed proportionally based on agents' scores:  
     ```
     extraShare = (agentScore / totalScoreRemaining) * remainingKitty
     ```
   - Each agent's final allocation = `minPerAgent + extraShare`.  

3. **Max Constraint Check**  
   - If any agent’s allocation exceeds `maxPerAgent`, it is capped.  
   - The leftover kitty is then redistributed among the remaining eligible agents.  

4. **Final Adjustment**  
   - If rounding causes the total allocation ≠ siteKitty,  
     the difference is adjusted in the last agent’s discount.  


### 🔹 Justification
```
Identify the top 2 contributing metrics for each agent

Generate a natural sentence like:

"Consistently high performance and long-term contribution"

"Strong target achievement and solid client base"
```

### 🔹 Summary Report

Generated a brief summary about discount allocation and its related stats for each agents

```
totalKitty
totalAllocated
remainingKitty (if mismatch due to rounding/constraints)
averageDiscount
maxDiscount
minDiscount

```

## 🧾 Assumptions
- If minPerAgent or maxPerAgent is not provided in input.json, defaults are applied:

- minPerAgent = siteKitty / (10 * numberOfAgents)

- maxPerAgent = siteKitty / 2

- Weights in config.json always sum approximately to 1.0.

- Justifications are kept short and based on the top two contributing metrics.

- Rounding differences are adjusted so that the total allocation never exceeds siteKitty.

---

## 🛠️ How I Solved the Problem
## 📝 Understanding Requirements

- Input data about sales agents

- Allocation must be fair & proportional to multiple factors

- Constraints (min/max per agent) must be respected

- Human-readable justification for every allocation

### 🪜 Step-by-Step Implementation

**Step 1** : 📥 Get the necessary data by reading into input file or input.json

**Step 2** : ✅ Verified the format and required entries from data

**Step 3** : 🔄 Normalized all metrics (0–1 scale)

**Step 4** : ⚖️ Combined them using weighted scoring (from config.json)

**Step 5** : 💰 First allocated minperAgent to each agent then allocated remaining kitty proportionally using adjudged scores and total remaining discount to be allocated

**Step 6** : 🚧 Applied max constraints dynamically to allocate a fair allocation , adjusted the rounding mismatch to last agent

**Step 7** : 📝 Generated output JSON with allocations & justifications

**Step 8** : 📊 Added a summary block for quick analysis

## ✨ Enhancements Made

- 🖥️ **CLI support with input/output/config as arguments**

- ⚙️ **Configurable weights (instead of hardcoded)**

- ❌ **Error handling for invalid/missing files**

- 📊 **Summary report with statistics**

---

## 🧪 Testing
This project includes a full set of integration and logic tests to ensure that the discount allocation engine works reliably across various scenarios.

### ✅ What’s Covered?
## integration.test.js

- Complete pipeline: from input to final output

- Validates minimum & maximum constraints

- Ensures total kitty is fairly and fully distributed

## allocation.test.js

- Handles min/max allocation constraints

- Confirms proportional distribution of remaining kitty

## scoring.test.js

- Validates weighted score computation

- Checks if each factor contributes correctly based on weights

## justification.test.js

- Ensures top 2 contributing metrics are correctly picked

- Justification message is human-readable and accurate

🔍 These tests go beyond simple units and focus on real use-case behavior and results.

## 🚀 Running the Tests
After installing dependencies via:

```
npm install

```

Run all tests using:

```
npm test

```

## 📁 Tests Directory Structure

```
tests/
│
├── allocation.test.js       # Allocation logic and min/max handling
├── integration.test.js      # End-to-end flow test
├── justification.test.js    # Justification sentence generator
├── scoring.test.js          # Weighted score calculator

```
---

📸 Screenshots / Demo 

### 🖥️  Terminal
<img width="1373" height="307" alt="image" src="https://github.com/user-attachments/assets/c2943b0a-db88-438a-9366-1111851bffd9" />

### 📤 Sample output.json
<img width="1345" height="803" alt="image" src="https://github.com/user-attachments/assets/333103a8-2090-4600-a16b-bb1c98034f65" />

---

✅ Conclusion
This project implements a flexible, production-ready discount allocation engine with configurable logic, fairness, and reporting. It can be extended into a web app or integrated into a larger system.


## 🙌 Built with ❤️ by Md Sajid
