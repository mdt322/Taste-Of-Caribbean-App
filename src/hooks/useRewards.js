import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const useRewards = () => {
    const [rewardItems, setRewardItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            const foodQuery = query(collection(db, 'menu_items'), where("points", "!=", null));
            const merchQuery = query(collection(db, 'merch_items', where("points", "!=", null)));

            const unsubscribeFood = onSnapshot(
                foodQuery,
                (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        reward_type: "food",
                        ...doc.data()
                    }));
                    setRewardItems(prev => [...items]);
                },
                (err) => {
                    console.error('Error fetching reward items:', err);
                    setError(err);
                    setLoading(false);
                }
            );
            const unsubscribeMerch = onSnapshot(
                merchQuery,
                (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        reward_type: "merch",
                        ...doc.data()
                    }));
                    setRewardItems(prev => [...items]);
                },
                (err) => {
                    console.error('Error fetching reward items:', err);
                    setError(err);
                    setLoading(false);
                }
            );

            return () => {
                unsubscribeFood();
                unsubscribeMerch();
            };
        }, []);
    return (rewardItems, loading, error)
};