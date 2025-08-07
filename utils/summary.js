function generateSummary(siteKitty, totalAllocated, remainingKitty, discounts) {
  return {
    totalKitty: siteKitty,
    totalAllocated,
    remainingKitty,
    averageDiscount: Math.round(totalAllocated / discounts.length),
    maxDiscount: Math.max(...discounts),
    minDiscount: Math.min(...discounts)
  };
}

module.exports = { generateSummary };
