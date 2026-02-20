/** Create a fresh days array for 30 days */
export function createDays() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    status: i === 0 ? 'available' : 'locked',
    description: '',
    fileName: '',
    fileType: '',
    summary: null,
    completedAt: null,
    missedAt: null,
  }));
}

/** Detect missed days from last-open date and update the days array */
export function detectMissed(days, startDateISO) {
  const startDate = new Date(startDateISO);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysPassed = Math.floor((today - startDate) / 86400000); // days elapsed

  let updated = [...days];
  let missedCount = 0;
  let failed = false;

  const originalDaysCount = 30;

  for (let i = 0; i < updated.length; i++) {
    const d = updated[i];
    const dayIdx = d.id - 1;
    const dayDue = new Date(startDate);
    dayDue.setDate(dayDue.getDate() + dayIdx);
    dayDue.setHours(0, 0, 0, 0);

    const isDueBeforeToday = dayDue < today;

    // Check original 30 days
    if (d.id <= originalDaysCount) {
      if (isDueBeforeToday && d.status === 'available') {
        updated[i] = { ...d, status: 'missed', missedAt: dayDue.toISOString() };
        missedCount++;
      }
      // Unlock current day if it's the current legal day (real-time based)
      if (d.id === (daysPassed + 1) && d.status === 'locked') {
        updated[i] = { ...d, status: 'available' };
      }
    }
  }

  // Failure logic: "فشل يوم التعويض = فشل التحدي"
  // If we are past the 30 days and we still have missed days
  if (daysPassed >= originalDaysCount) {
    const hasMissed = updated.some(d => d.status === 'missed');
    if (hasMissed) {
      const compensated = updated.filter(d => d.status === 'compensated').length;
      const totalMissedInitial = updated.filter(d => d.status === 'missed').length + compensated;
      
      // Extension Deadline = 30 + totalMissedInitial
      if (daysPassed >= (originalDaysCount + totalMissedInitial)) {
        failed = true;
      }
    }
  }

  return { updated, missedCount, failed };
}

/** Compute compensation days */
export function computeCompensation(days) {
  return days.filter(d => d.status === 'missed');
}
