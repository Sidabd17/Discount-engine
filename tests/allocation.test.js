const { allocateDiscounts } = require('../utils/allocation');

test('minimum allocation for all agents when kitty is just enough', () => {
  const agents = [
    { id: "A1", score: 1 },
    { id: "A2", score: 1 },
  ];
  const min = 1000;
  const max = 3000;
  const kitty = 2000;

  const result = allocateDiscounts(agents, kitty, min, max);

  expect(result.individualDiscounts.map(a => a.discount)).toEqual([1000, 1000]);

});
