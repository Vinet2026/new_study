const ONE_DAY = 24 * 60 * 60 * 1000;

export function buildExpeditionDeck(allQuestions, wrongPoolByProfile, category = 'all', grade = 'ALL', count = 6) {
  let filtered = allQuestions;
  if (category !== 'all') {
    const byCat = filtered.filter(q => q.category === category);
    if (byCat.length) filtered = byCat;
  }
  if (grade && grade !== 'ALL') {
    const byGrade = filtered.filter(q => !q.grade || q.grade === grade);
    if (byGrade.length) filtered = byGrade;
  }
  const source = filtered.length ? filtered : allQuestions;
  const now = Date.now();

  const dueMistakes = Object.values(wrongPoolByProfile || {})
    .filter(m => m.nextReviewAt <= now && (category === 'all' || m.category === category))
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, Math.max(1, Math.floor(count * 0.35)));

  const qMap = new Map(allQuestions.map(q => [q.id, q]));
  const reviewItems = dueMistakes
    .map(m => qMap.get(m.questionId))
    .filter(Boolean)
    .map(q => ({ ...q, isReviewMonster: true }));

  const usedIds = new Set(reviewItems.map(q => q.id));
  const fresh = source.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
  const deck = fresh.slice(0, Math.max(1, count - reviewItems.length));

  reviewItems.forEach((item, i) => {
    deck.splice(Math.min(deck.length, (i + 1) * 2), 0, item);
  });
  return deck;
}

export function updateMonsterRecord(wrongPoolByProfile, q, isCorrect) {
  const now = Date.now();
  const existing = wrongPoolByProfile[q.id];

  if (!isCorrect) {
    wrongPoolByProfile[q.id] = {
      questionId: q.id,
      category: q.category || 'custom',
      wrongCount: (existing?.wrongCount || 0) + 1,
      streak: 0,
      lastReviewedAt: now,
      nextReviewAt: now + 12 * 60 * 60 * 1000
    };
    return 'escaped';
  }
  if (existing) {
    existing.streak += 1;
    existing.lastReviewedAt = now;
    if (existing.streak >= 2) {
      delete wrongPoolByProfile[q.id];
      return 'captured';
    }
    existing.nextReviewAt = now + ONE_DAY;
    return 'weakened';
  }
  return 'normal';
}
