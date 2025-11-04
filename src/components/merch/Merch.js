import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Merch = () => {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>Merch</Text>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Merch;
