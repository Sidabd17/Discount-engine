function calculateScores(agents, weights) {
  return agents.map(agent => {
    const score =
      weights.performance * agent.performanceScore +
      weights.seniority * agent.seniorityMonths +
      weights.target * agent.targetAchievedPercent +
      weights.clients * agent.activeClients;

    return {
      id: agent.id,
      score: Math.round(score * 100) / 100
    };
  });
}

module.exports = { calculateScores };
