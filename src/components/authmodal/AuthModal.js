import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen'

const AuthModal = ({ setAuthFlag, authMode, setAuthMode }) => {

    const renderContent = () => {
        switch (authMode) {

            case ('Sign In'):
                return (
                    <LoginScreen setAuthFlag={setAuthFlag} setAuthMode={setAuthMode} />
                );

            case ('Register'):
                return (
                    <RegisterScreen setAuthMode={setAuthMode} />
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