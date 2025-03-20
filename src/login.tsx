import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Platform, Animated, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './Auth/AuthContext';
import EyeIcon from '../assets/eye-solid.svg';
import EyeOffIcon from '../assets/eye-slash-solid.svg';
import colors from './Styles/color';
import AnimationStatus from './AnimationStatus/AnimationStatus';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Main/Main';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register', 'ForgotPassword'>;

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, url } = useAuth();
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');

    const dismissKeyboard = () => Keyboard.dismiss();
    const navigation = useNavigation<NavigationProp>();
    useFocusEffect(
        useCallback(() => {
            setErrors({});
        }, [])
    );
    const validateUsername = (value: string) => {
        if (!value || value.length < 4) {
            setErrors((prev) => ({ ...prev, username: 'Username must have at least 4 characters.' }));
        } else {
            setErrors((prev) => ({ ...prev, username: undefined }));
        }
    };

    const validatePassword = (value: string) => {
        if (!value || value.length < 6 || !/\d/.test(value)) {
            setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters and contain at least one number.' }));
        } else {
            setErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    const isValid = () => !errors.username && !errors.password;
    const handleLogin = async () => {
        dismissKeyboard();
        validateUsername(username);
        validatePassword(password);

        if (!username || !password || !isValid()) return; // Chặn request nếu có lỗi

        try {
            setStatus('loading');
            setStatusText('Sign in...');

            const response = await fetch(`${url}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            const { token, user } = data;
            await setAuth(token, user);

            setStatus('success');
            setStatusText('Sign in successful!');
        } catch (error) {
            setStatus('error');
            setStatusText(error instanceof Error ? error.message : 'Login failed');
        }
    };
    useFocusEffect(
        useCallback(() => {
            const handleBackPress = () => {
                Alert.alert(
                    'Confirm Exit',
                    'Are you sure you want to exit the application?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Exit', onPress: () => BackHandler.exitApp() },
                    ]
                );
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            return () => backHandler.remove(); // Xóa lắng nghe khi rời màn hình
        }, [])
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Sign In</Text>

                    <TextInput
                        placeholder="User name"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            validateUsername(text);
                        }}
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                validatePassword(text);
                            }}
                            secureTextEntry={!showPassword}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                            {showPassword ? (
                                <EyeIcon width={24} height={24} fill="#333" />
                            ) : (
                                <EyeOffIcon width={24} height={24} fill="#333" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>SIGN IN</Text>
                        </TouchableOpacity>
                        <View style={styles.registerContainer}>
                            <Text style={{ fontSize: 16 }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerText}>Sign up here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>


            </TouchableWithoutFeedback>
            <AnimationStatus
                status={status}
                text={statusText}
                onDone={() => setStatus(null)}
                show={!!status}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: colors.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.textPrimary,
        padding: 14,
        marginBottom: 25,
        borderRadius: 12,
        backgroundColor: colors.background,
        flex: 1,
        fontSize: 16,
        maxHeight: 50,
    },
    error: {
        color: colors.error,
        marginBottom: 15,
        marginTop: -20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 30,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerText: {
        color: colors.primary,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    icon: {
        position: 'absolute',
        right: 12,
        top: '20%',
    },
    forgotPassword:
    {
        color: colors.primary,
        marginBottom: 0,
        textAlign: 'right',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
