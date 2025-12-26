import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();
const STATS_COLLECTION = 'geogenie_stats';

async function listStats() {
    console.log(`Querying ${STATS_COLLECTION} collection...`);
    try {
        const snapshot = await firestore.collection(STATS_COLLECTION)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        if (snapshot.empty) {
            console.log('No matching documents found.');
            return;
        }

        console.log(`Found ${snapshot.size} recent records:\n`);

        snapshot.forEach(doc => {
            const data = doc.data();
            // Format timestamp if it exists (Firestore Timestamp object)
            const time = data.timestamp && data.timestamp.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;

            console.log(`ID: ${doc.id}`);
            console.log(`User: ${data.userName} (${data.userEmail})`);
            console.log(`Level: ${data.levelId} | Score: ${data.score}/${data.totalAttempts}`);
            console.log(`Accuracy: ${data.accuracy}% | Duration: ${data.durationSeconds}s`);
            console.log(`Mistakes:`, JSON.stringify(data.entities || {}));
            console.log(`Time: ${time}`);
            console.log('-'.repeat(40));
        });
    } catch (err) {
        console.error('Error getting documents', err);
    }
}

listStats();
