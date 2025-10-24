import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const useRewards = () => {
    const [rewardItems, setRewardItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'reward_items'));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const items = snapshot.docs.map(
                    doc => ({
                        id: doc.f_id,
                        ...doc.data()
                    })
                );
                setRewardItems(items);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching reward items: ', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { rewardItems, loading, error };
};