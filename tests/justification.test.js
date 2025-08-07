const { getJustification } = require('../utils/justification');

test('generates correct justification for top 2 contributions', () => {
  const agent = {
    performanceScore: 0.9,
    seniorityMonths: 0.3,
    targetAchievedPercent: 0.8,
    activeClients: 0.2,
  };

  const weights = {
    performance: 0.4,
    seniority: 0.2,
    target: 0.3,
    clients: 0.1,
  };

  const result = getJustification(agent, weights);
  expect(result).toMatch(/high performance.*strong target achievement/);
});
