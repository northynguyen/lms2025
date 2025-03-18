import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import LoginScreen from '../login';
import RegisterScreen from '../register';
import ForgotPasswordScreen from '../forgotpass';
import HomeStudent from '../Student/HomeStudent';
import HomeInstructor from '../Instructor/HomeInstructor';
import HomeSuperadmin from '../SuperAdmin/HomeSuperadmin';
import { useAuth } from '../Auth/AuthContext';
import AnimationStatus from '../AnimationStatus/AnimationStatus';

// Cập nhật RootStackParamList
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    HomeStudent: undefined;
    HomeInstructor: undefined;
    HomeSuperadmin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Main = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <AnimationStatus
                status="loading"
                text="Loading..."
                onDone={() => { }}
                show={true}
            />
        );
    }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? getHomeScreen(user.role) : 'Login'}>
                {user ? (
                    <>
                        {user.role === 'Student' && (
                            <Stack.Screen
                                name="HomeStudent"
                                component={HomeStudent}
                                options={{ headerShown: false }}
                            />
                        )}
                        {user.role === 'Instructor' && (
                            <Stack.Screen
                                name="HomeInstructor"
                                component={HomeInstructor}
                                options={{ headerShown: false }}
                            />
                        )}
                        {user.role === 'Superadmin' && (
                            <Stack.Screen
                                name="HomeSuperadmin"
                                component={HomeSuperadmin}
                                options={{ headerShown: false }}
                            />
                        )}
                    </>
                ) : (
                    // Nếu chưa đăng nhập, hiển thị màn hình login/register/forgotPassword
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPasswordScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// Xác định màn hình home tương ứng với vai trò
const getHomeScreen = (role: string) => {
    switch (role) {
        case 'Instructor':
            return 'HomeInstructor';
        case 'Student':
            return 'HomeStudent';
        case 'Superadmin':
            return 'HomeSuperadmin';
        default:
            return 'Login';
    }
};

export default Main;
