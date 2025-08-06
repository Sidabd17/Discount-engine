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

### 2️⃣ Project Files  
The tool requires the following files:

- 📥 **`input.json`** → Contains site kitty and sales agents data  
- ⚙️ **`config.json`** → Contains allocation weights and optional min/max constraints  
- 📤 **`output.json`** → (optional) Generated output file with allocations and summary  

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
🔹 Normalization
```
Performance: score / 100

Target Achievement: percent / 100

Seniority: months / maxMonths

Clients: activeClients / maxClients
```

🔹 Weighted Score Calculation
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


🔹 Justification
```
Identify the top 2 contributing metrics for each agent

Generate a natural sentence like:

"Consistently high performance and long-term contribution"

"Strong target achievement and solid client base"
```

🔹 Summary Report

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

- minPerAgent = siteKitty / (2 * numberOfAgents)

- maxPerAgent = siteKitty / 2.5

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

📸 Screenshots / Demo (Optional)

### 🖥️  Terminal
<img width="1373" height="307" alt="image" src="https://github.com/user-attachments/assets/c2943b0a-db88-438a-9366-1111851bffd9" />

### 📤 Sample output.json
<img width="1345" height="803" alt="image" src="https://github.com/user-attachments/assets/333103a8-2090-4600-a16b-bb1c98034f65" />

---

✅ Conclusion
This project implements a flexible, production-ready discount allocation engine with configurable logic, fairness, and reporting. It can be extended into a web app or integrated into a larger system.


## 🙌 Built with ❤️ by Md Sajid
