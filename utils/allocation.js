function allocateDiscounts(agents, totalKitty, minPerAgent, maxPerAgent) {
  const numberOfAgents = agents.length;
  const individualDiscounts = [];

  // Step 1: Feasibility check
  if (totalKitty < minPerAgent * numberOfAgents) {
    throw new Error("Kitty too small to satisfy minimum allocation per agent");
  }

  // Step 2: Allocate minPerAgent to each agent
  for (const agent of agents) {
    individualDiscounts.push({
      id: agent.id,
      score: agent.score,
      discount: minPerAgent,
    });
  }

  let totalAllocated = minPerAgent * numberOfAgents;
  let totalDiscountRemaining = totalKitty - totalAllocated;

  // Step 3: Remaining score sum
  let scoreRemaining = agents.reduce((sum, a) => sum + a.score, 0);

  // Step 4: Distribute remaining kitty proportionally
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    const share = (agent.score / scoreRemaining) * totalDiscountRemaining;

    // max cap check
    const currentDiscount = individualDiscounts[i].discount;
    const maxAllowed = maxPerAgent - currentDiscount;

    const allocatable = Math.min(Math.round(share), maxAllowed);

    individualDiscounts[i].discount += allocatable;
    totalAllocated += allocatable;
    totalDiscountRemaining -= allocatable;
    scoreRemaining -= agent.score;
  }

  // Step 5: Final rounding adjustment (if required)
  if (totalDiscountRemaining !== 0) {
    individualDiscounts[agents.length - 1].discount += totalDiscountRemaining;
    totalAllocated += totalDiscountRemaining;
    totalDiscountRemaining = 0;
  }

  return {
    individualDiscounts,
    totalAllocated,
    totalDiscountRemaining
  };
}

module.exports = { allocateDiscounts };
