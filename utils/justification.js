function getJustification(agent, weights) {
  const contributions = {
    performance: weights.performance * agent.performanceScore,
    seniority: weights.seniority * agent.seniorityMonths,
    target: weights.target * agent.targetAchievedPercent,
    clients: weights.clients * agent.activeClients
  };

  const sorted = Object.entries(contributions).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0][0];
  const top2 = sorted[1]?.[0];

  const phrases = {
    performance: "high performance",
    seniority: "long-term contribution",
    target: "strong target achievement",
    clients: "solid client base"
  };

  if (top1 && top2) return `Consistently ${phrases[top1]} and ${phrases[top2]}`;
  if (top1) return `Consistently ${phrases[top1]}`;
  return "Balanced contribution";
}

module.exports = { getJustification };
