import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const AuthModal = ({ setAuthFlag, authMode, setAuthMode }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const renderContent = () => {
        switch (authMode) {

            case ('Sign In'):
                return (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Sign In</Text>
                        </View>
                        <View style={styles.infoContainer}>

                            {/* Email entry */}
                            <Text style={styles.infoText}>
                                Email:
                            </Text>
                            <TextInput
                                value={email}
                                onChange={(setEmail)}
                                style={styles.input}
                            />

                            {/* Password entry */}
                            <Text style={styles.infoText}>
                                Password:
                            </Text>
                            <TextInput
                                value={password}
                                onChange={(setPassword)}
                                style={styles.input}
                            />

                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.signinButton]}>
                                <Text style={styles.buttonText}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setAuthFlag(false)}>
                                <Text style={styles.buttonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer banner */}
                        <View style={styles.header3}>
                            <Text style={styles.title3}>Don't have an account? </Text>
                            <TouchableOpacity
                                onPress={() => setAuthMode('Register')}
                            >
                                <Text style={styles.registerText}>
                                    Click here to register!
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case ('Register'):
                return (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Register</Text>
                        </View>
                        <View style={styles.infoContainer}>

                            {/* Name entry */}
                            <Text style={styles.infoText}>
                                Name:
                            </Text>
                            <TextInput
                                value={name}
                                onChange={(setName)}
                                style={styles.input}
                            />

                            {/* Email entry */}
                            <Text style={styles.infoText}>
                                Email:
                            </Text>
                            <TextInput
                                value={email}
                                onChange={(setEmail)}
                                style={styles.input}
                            />

                            {/* Phone entry */}
                            <Text style={styles.infoText}>
                                Phone (optional):
                            </Text>
                            <TextInput
                                value={phone}
                                onChange={(setPhone)}
                                style={styles.input}
                            />

                            {/* Password entry */}
                            <Text style={styles.infoText}>
                                Password:
                            </Text>
                            <TextInput
                                value={password}
                                onChange={(setPassword)}
                                style={styles.input}
                            />

                            {/* Confirm Password entry */}
                            <Text style={styles.infoText}>
                                Confirm Password:
                            </Text>
                            <TextInput
                                value={password}
                                onChange={(setPassword)}
                                style={styles.input}
                            />

                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.registerButton]}>
                                <Text style={styles.buttonText}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setAuthMode('Sign In')}>
                                <Text style={styles.buttonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
        }
    }

    return (
        <>{renderContent()}</>
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
    infoContainer: {
        marginVertical: 35,
        marginHorizontal: 30,
    },
    infoText: {
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
    registerButton: {
        backgroundColor: '#00d346ff',
    },
    cancelButton: {
        backgroundColor: '#9e9d9dff',
    },
    header3:{
        flexDirection: 'row',
        marginHorizontal: 'auto',
        marginTop: 15,
    },
    title3: {
        fontSize: 12,
    },
    registerText: {
        fontSize: 12,
        color: '#007de4ff',
    },
});


export default AuthModal;