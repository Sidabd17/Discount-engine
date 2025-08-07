function normalizeAgents(agents, maxSeniority, maxClients) {
  return agents.map(agent => ({
    id: agent.id,
    performanceScore: agent.performanceScore / 100,
    seniorityMonths: agent.seniorityMonths / (maxSeniority || 1),
    targetAchievedPercent: agent.targetAchievedPercent / 100,
    activeClients: agent.activeClients / (maxClients || 1)
  }));
}

module.exports = { normalizeAgents };
