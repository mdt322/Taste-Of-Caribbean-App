import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen'

const AuthModal = ({ setAuthFlag, authMode, setAuthMode }) => {

    // Determines with authMode what to display when popping up
    const renderContent = () => {
        switch (authMode) {

            // LoginScreen has option to switch to Register mode
            // RegisterScreen has option to switch back to SignIn mode
            // setAuthFlag passed to both in case there is an implementation to close the window whenever the user wants.
            case ('Sign In'):
                return (
                    <LoginScreen setAuthFlag={setAuthFlag} setAuthMode={setAuthMode} />
                );

            case ('Register'):
                return (
                    <RegisterScreen setAuthFlag={setAuthFlag} setAuthMode={setAuthMode} />
                );
        }
    }

    return (
        <>
            {renderContent()}
        </>
    )
};

const styles = StyleSheet.create({
    signinModal: {
    width: 300,
    borderRadius: 20,
  },
});
export default AuthModal;