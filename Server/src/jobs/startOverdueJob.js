const cron = require('node-cron');
const { runMarkOverdueForAllSomitis } = require('./runMarkOverdueForAllSomitis');

function startOverdueJob() {
   cron.schedule('5 0 * * *', runMarkOverdueForAllSomitis, { timezone: 'Asia/Dhaka' });
}

module.exports = { startOverdueJob };