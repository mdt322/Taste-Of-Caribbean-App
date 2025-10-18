import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const SignIn = ({ setSigninFlag }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sign In</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Email:
                </Text>
                <TextInput
                    value={email}
                    onChange={(setEmail)}
                    style={styles.input}
                />
                <Text style={styles.infoText}>
                    Password:
                </Text>
                <TextInput
                    value={password}
                    onChange={(setPassword)}
                    style={styles.input}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.signinButton]}>
                    <Text style={styles.buttonText}>
                        Sign In
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setSigninFlag(false)}>
                    <Text style={styles.buttonText}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',
    },
    header: {
        padding: 18,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer:{
        marginVertical: 35,
        marginHorizontal: 30,
    },
    infoText:{
        fontSize: 13,
    },
    input: {
        borderWidth: 1,
        borderColor: '#b6b6b6ff',
        borderRadius: 10,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 'auto',
    },
    button: {
        width: 150,
        paddingVertical: 14,
        marginHorizontal: 'auto', 
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
    },
    signinButton: {
        backgroundColor: '#0779bbff',
    },
    cancelButton: {
        backgroundColor: '#9e9d9dff',
    }
});


export default SignIn;