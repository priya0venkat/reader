// statsService.js - Handles saving game stats to backend
//
// The backend (server.js) saves these to Firestore.
// It requires the user to be authenticated (cookie session).

export const saveStats = async (stats) => {
    try {
        const response = await fetch('/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stats)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to save stats:', errorData);
            return false;
        }

        const data = await response.json();
        console.log('Stats saved:', data);
        return true;
    } catch (error) {
        console.error('Error post stats:', error);
        return false;
    }
};

export default { saveStats };
