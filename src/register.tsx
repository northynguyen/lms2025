import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './Auth/AuthContext';
import EyeIcon from '../assets/eye-solid.svg';
import EyeOffIcon from '../assets/eye-slash-solid.svg';
import colors from './Styles/color';
import { RadioButton } from 'react-native-paper';
import AnimationStatus from './AnimationStatus/AnimationStatus';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Main/Main';
type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'Student' | 'Instructor'>('Student');
    const { setAuth, url } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');

    const [errors, setErrors] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const navigation = useNavigation<NavigationProp>();
    useFocusEffect(
        useCallback(() => {
            setErrors({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
            });
        }, [])
    );
    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'username':
                if (!value || value.length < 4) {
                    error = 'Username must have at least 4 characters.';
                }
                break;
            case 'password':
                if (!value || value.length < 6 || !/\d/.test(value)) {
                    error = 'Password must be at least 6 characters and contain at least one number.';
                }
                break;
            case 'firstName':
                if (!value) {
                    error = 'Please enter your First Name.';
                }
                break;
            case 'lastName':
                if (!value) {
                    error = ' Please enter your Last Name';
                }
                break;
            case 'email':
                if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                    error = 'Please enter a valid email.';
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
        return error;
    };

    const validateAllFields = () => {
        const newErrors = {
            username: validateField('username', username),
            password: validateField('password', password),
            firstName: validateField('firstName', firstName),
            lastName: validateField('lastName', lastName),
            email: validateField('email', email),
        };

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === '');
    };

    const handleRegister = async () => {
        if (!validateAllFields()) return;

        try {
            setStatus('loading');
            setStatusText('Signing up...');
            const response = await fetch(`${url}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, firstName, lastName, email, role }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Sign up failed');
            const { token, user } = data;
            await setAuth(token, user);
            setStatus('success');
            setStatusText('Sign up successful!');
        } catch (error) {
            setStatus('error');
            const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
            setStatusText(errorMessage);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Sign Up</Text>

                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => { setUsername(text); validateField('username', text); }}
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => { setPassword(text); validateField('password', text); }}
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

                    <TextInput
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={(text) => { setFirstName(text); validateField('firstName', text); }}
                        style={styles.input}
                    />
                    {errors.firstName ? <Text style={styles.error}>{errors.firstName}</Text> : null}

                    <TextInput
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={(text) => { setLastName(text); validateField('lastName', text); }}
                        style={styles.input}
                    />
                    {errors.lastName ? <Text style={styles.error}>{errors.lastName}</Text> : null}

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => { setEmail(text); validateField('email', text); }}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
                    <View>
                        <Text style={styles.label}>Student or Instructor</Text>

                        <View style={styles.roleContainer}>
                            <View style={styles.radioItem}>
                                <RadioButton
                                    value="Student"
                                    status={role === 'Student' ? 'checked' : 'unchecked'}
                                    onPress={() => setRole('Student')}
                                />
                                <Text style={styles.roleText}>Student</Text>
                            </View>

                            <View style={styles.radioItem}>
                                <RadioButton
                                    value="Instructor"
                                    status={role === 'Instructor' ? 'checked' : 'unchecked'}
                                    onPress={() => setRole('Instructor')}
                                />
                                <Text style={styles.roleText}>Instructor</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>

                    <View style={styles.signInContainer}>
                        <Text style={{ fontSize: 16 }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <AnimationStatus
                    status={status}
                    text={statusText}
                    onDone={() => setStatus(null)}
                    show={!!status}
                />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 0 : 50 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
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
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: colors.background,
        flex: 1,
        fontSize: 16,
        maxHeight: 50,
    },
    error: { color: colors.error, fontSize: 14, marginBottom: 20, marginTop: -10 },
    backButton: { marginTop: 20, alignSelf: 'center' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center' },
    icon: { position: 'absolute', right: 12, top: '20%' },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.textPrimary,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    signInText: {
        color: colors.primary,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
export default RegisterScreen;
