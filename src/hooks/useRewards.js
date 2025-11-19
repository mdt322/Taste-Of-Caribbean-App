import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const useRewards = () => {
    const [foodRewards, setFoodRewards] = useState([]);
    const [merchRewards, setMerchRewards] = useState([]);
    const [rewardItems, setRewardItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const foodQuery = query(
            collection(db, 'menu_items'),
            where("points", "!=", null)
        );
        const merchQuery = query(
            collection(db, 'merch_items'),
            where("points", "!=", null)
        );

        // both snapshots run asyncroniously, so both adjust the loading flag as needed
        // eg both would need to be ready to have the page load in RewardsScreen
        const unsubscribeFood = onSnapshot(
            foodQuery,
            (snapshot) => {
                setLoading(true);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    reward_type: "food",
                    ...doc.data()
                }));
                setFoodRewards(items);
                setLoading(false);
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
                setLoading(true);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    reward_type: "merch",
                    ...doc.data()
                }));
                setMerchRewards(items);
                setLoading(false);
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

    useEffect(() => {
        setRewardItems([...foodRewards, ...merchRewards]);
    }, [foodRewards, merchRewards]);

    return { rewardItems, loading, error };
};