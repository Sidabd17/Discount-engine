const { normalizeAgents } = require("../utils/normalize");
const { calculateScores } = require("../utils/scoring");
const { allocateDiscounts } = require("../utils/allocation");

test("integration of normalization → scoring → allocation", () => {
  const agents = [
    {
      id: "A1",
      performanceScore: 80,
      seniorityMonths: 20,
      targetAchievedPercent: 90,
      activeClients: 10,
    },
    {
      id: "A2",
      performanceScore: 60,
      seniorityMonths: 10,
      targetAchievedPercent: 70,
      activeClients: 5,
    },
  ];

  const weights = {
    performance: 0.4,
    seniority: 0.3,
    target: 0.2,
    clients: 0.1,
  };

  const kitty = 2000;
  const min = 500;
  const max = 1500;

  // Step 1: Normalize
  const normalized = normalizeAgents(agents);

  // Step 2: Score
  const scores = calculateScores(normalized, weights);

  // Step 3: Allocation
  const result = allocateDiscounts(scores, kitty, min, max);

  expect(result.individualDiscounts.length).toBe(2);
  expect(result.totalAllocated).toBe(2000);
  expect(result.totalDiscountRemaining).toBe(0);

})
