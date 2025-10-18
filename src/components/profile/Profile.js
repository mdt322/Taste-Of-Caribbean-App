import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Profile = () => {
    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* Greeting message */}
            <View style={styles.header2}>
                <Text style={styles.title2}>You are not logged in!</Text>
            </View>

            {/* Profile summary box, shows loyalty points and option to view order history */}
            <View style={styles.summary}>
                <Text style={styles.summaryAlert}>You won't earn points without an account!</Text>
            </View>

            {/* Button container for signing in and registering */}
            <View>
                <TouchableOpacity style={[styles.button, styles.signInButton]}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.header3}>
                    <Text style={styles.title3}>Don't have an account? </Text>
                    <TouchableOpacity> 
                        <Text style={styles.registerText}>
                            Click here to register!
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        marginBottom: 16,
    },
    header2: {
        marginHorizontal: 'auto',
        marginTop: 15,
    },
    title2:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    header3:{
        flexDirection: 'row',
        marginHorizontal: 'auto',
        marginTop: 10,
    },
    title3: {
        fontSize: 12,
    },
    registerText: {
        fontSize: 12,
        color: '#007de4ff',
    },
    summary: {
        height: 300,
        width: 350,
        padding: 20,
        marginHorizontal: 'auto',
        marginTop: 15,
        borderRadius: 20,
        backgroundColor: '#ccccccff',
        alignItems: 'center',
    },
    summaryAlert: {
        fontSize: 16,
    },
    button: {
        width: 230,
        paddingVertical: 18,
        marginHorizontal: 'auto', 
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#0779bbff',
        marginTop: 18,
    },
    // registerButton: {
    //     backgroundColor: '#04c73fff',
    //     marginTop: 8,
    // }

});

export default Profile;