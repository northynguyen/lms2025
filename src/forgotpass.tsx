import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import colors from "./Styles/color";
import EyeIcon from '../icon/eye-solid.svg';
import EyeOffIcon from '../icon/eye-slash-solid.svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Main/Main';
import AnimationStatus from "./AnimationStatus/AnimationStatus";
import { useAuth } from "./Auth/AuthContext";

type NavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [tokenReset, setTokenReset] = useState('');
    const [animationStatus, setAnimationStatus] = useState<{ status: 'loading' | 'success' | 'error' | null; text?: string }>({ status: null });
    const { url } = useAuth();

    const navigation = useNavigation<NavigationProp>();

    const validateFields = async () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!email) {
                newErrors.email = 'Please enter your email';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newErrors.email = 'Invalid email format';
            } else {
                const emailExists = await checkEmailExists(email);
                if (!emailExists) {
                    newErrors.email = 'Email not registered';
                }
            }
        }

        if (step === 2 && !otp) newErrors.otp = 'Please enter OTP';

        if (step === 3) {
            if (!newPassword) newErrors.newPassword = 'Please enter a new password';
            else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';

            if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendOtp = async () => {
        if (!(await validateFields())) return;

        try {
            setAnimationStatus({ status: 'loading', text: 'Sending OTP...' });

            const response = await fetch(`${url}/api/otp/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setStep(2);
                setCountdown(60);
                setCanResend(false);
                setAnimationStatus({ status: 'success', text: 'OTP sent successfully!' });
            } else {
                setAnimationStatus({ status: 'error', text: data.message || 'Unable to send OTP.' });
            }
        } catch (error) {
            setAnimationStatus({ status: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    const verifyOtp = async () => {
        if (!(await validateFields())) return;

        try {
            setAnimationStatus({ status: 'loading', text: 'Verifying OTP...' });

            const response = await fetch(`${url}/api/otp/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (response.ok) {
                setTokenReset(data.resetToken);
                setStep(3);
                setAnimationStatus({ status: 'success', text: 'OTP verified!' });
            } else {
                setAnimationStatus({ status: 'error', text: data.error || 'Invalid OTP.' });
            }
        } catch (error) {
            setAnimationStatus({ status: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    const updatePassword = async () => {
        if (!(await validateFields())) return;

        try {
            setAnimationStatus({ status: 'loading', text: 'Updating password...' });

            const response = await fetch(`${url}/api/user/update-password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenReset, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnimationStatus({ status: 'success', text: 'Password updated successfully!' });
                setTimeout(() => navigation.navigate('Login'), 3000);
            } else {
                setAnimationStatus({ status: 'error', text: data.error || 'Failed to update password.' });
            }
        } catch (error) {
            setAnimationStatus({ status: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const checkEmailExists = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`${url}/api/user/is-email-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setAnimationStatus({ status: 'error', text: data.message || 'Error checking email.' });
                return false;
            }

            return data.exists;
        } catch (error) {
            setAnimationStatus({ status: 'error', text: 'An error occurred while checking the email.' });
            return false;
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.inner}>
                {step === 1 && (
                    <>
                        <Text style={styles.title}>Forgot Password</Text>
                        <View>
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                                }}
                                style={styles.input}
                            />
                            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        </View>
                        <TouchableOpacity onPress={sendOtp} style={styles.button}>
                            <Text style={styles.buttonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={styles.title}>Verify OTP</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Enter OTP"
                                value={otp}
                                onChangeText={(text) => {
                                    setOtp(text);
                                    if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
                                }}
                                style={styles.inputOTP}
                            />
                            {canResend ? (
                                <TouchableOpacity onPress={sendOtp} style={styles.reSendButton}>
                                    <Text style={styles.reSend}>Resend OTP</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.reSendButton}>
                                    <Text style={styles.reSend}>{countdown}s</Text>
                                </TouchableOpacity>

                            )}
                        </View>
                        {errors.otp && <Text style={styles.error}>{errors.otp}</Text>}

                        <TouchableOpacity onPress={verifyOtp} style={styles.button}>
                            <Text style={styles.buttonText}>Verify OTP</Text>
                        </TouchableOpacity>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Text style={styles.title}>Reset Password</Text>
                        <View style={{ gap: 20 }}>
                            <TextInput
                                placeholder="New Password"
                                value={newPassword}
                                secureTextEntry
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (errors.newPassword || errors.confirmPassword) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            newPassword: '',
                                            confirmPassword: confirmPassword === text ? '' : prev.confirmPassword,
                                        }));
                                    }
                                }}
                                style={styles.input}
                            />
                            {errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

                            <TextInput
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                secureTextEntry
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            confirmPassword: newPassword === text ? '' : 'Passwords do not match',
                                        }));
                                    }
                                }}
                                style={styles.input}
                            />
                            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

                        </View>
                        <TouchableOpacity onPress={updatePassword} style={styles.button}>
                            <Text style={styles.buttonText}>Update Password</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Back to Login</Text>
                </TouchableOpacity>
            </ScrollView>
            <AnimationStatus {...animationStatus} onDone={() => setAnimationStatus({ status: null })} />
        </KeyboardAvoidingView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.background,
    },
    inner: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: colors.textPrimary,
    },
    input: {
        padding: 15,
        fontSize: 16,
        color: "#1E293B",
        backgroundColor: colors.background,
        flex: 3,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
    },
    inputOTP: {
        padding: 15,
        fontSize: 16,
        color: "#1E293B",
        backgroundColor: colors.background,
        flex: 3,
        borderWidth: 1,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    error: {
        color: colors.error,
        marginBottom: 20,
        marginTop: -10,
        textAlign: "left",
    },
    icon: {
        position: 'absolute',
        right: 12,
        top: '20%',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 20,

    },
    buttonText: {
        color: colors.background,
        fontSize: 18,
        fontWeight: "bold",
    },
    secondaryButton: {
        alignItems: "center",
    },
    secondaryButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: "600",
    },
    backText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,

    },
    reSendButton: {
        flex: 1.3,
        backgroundColor: colors.backgroundSecondary,
        paddingVertical: 15,
        borderEndWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0.3,
        borderBottomEndRadius: 12,
        borderTopEndRadius: 12,
    },
    reSend: {
        color: colors.textSecondary,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default ForgotPassword;
