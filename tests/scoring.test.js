const { calculateScores } = require('../utils/scoring');

test('calculates weighted score correctly', () => {
  const agents = [{
    id : "A1",
    performanceScore: 0.8,
    seniorityMonths: 0.5,
    targetAchievedPercent: 0.9,
    activeClients: 0.6,
  }];
  const weights = {
    performance: 0.3,
    seniority: 0.2,
    target: 0.3,
    clients: 0.2,
  };

  const result = calculateScores(agents, weights);
  const expectedScore = 
    0.8 * 0.3 + 0.5 * 0.2 + 0.9 * 0.3 + 0.6 * 0.2;

  expect(result[0].score).toBeCloseTo(expectedScore, 2);
});
