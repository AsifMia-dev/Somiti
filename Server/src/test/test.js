const runMarkOverdueForAllSomitis = require('../jobs/runMarkOverdueForAllSomitis').runMarkOverdueForAllSomitis;

runMarkOverdueForAllSomitis().then(() => {
  console.log('Mark overdue job completed successfully.');
  process.exit(0);
}).catch((err) => {
  console.error('Mark overdue job failed:', err);
  process.exit(1);
});