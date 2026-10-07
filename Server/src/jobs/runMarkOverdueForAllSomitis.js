const prisma = require('../lib/prisma');
const { markOverdue } = require('./markOverdue');
const { getCollectionDate } = require('../services/installmentService');

async function runMarkOverdueForAllSomitis() {
  const somitis = await prisma.somiti.findMany({
    select: { 
            id: true,
            collection_day: true, 
            monthly_collection_date: true 
        },
     });

  for (const s of somitis) {
    const collectionInfo = getCollectionDate(s.collection_day, s.monthly_collection_date, 'WEEKLY');
    const lastCollectionDate = new Date(collectionInfo.collectionDate);
    lastCollectionDate.setDate(lastCollectionDate.getDate() - 7);
    try {   
      await markOverdue({ somitiId: s.id, previousCollectionDate: lastCollectionDate });
    } catch (err) {
      console.error('markOverdue failed for somiti', s.id, err);
    }
  }
}

module.exports = { runMarkOverdueForAllSomitis };

