// HomeSuperadmin Component
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../Auth/AuthContext';

const HomeSuperadmin = () => {
    const { logout, user } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chào mừng bạn đến với trang Superadmin!</Text>
            <Text>Username: {user?.username}</Text>
            <Text>Role: {user?.role}</Text>
            <Text>Name: {user?.firstName} {user?.lastName}</Text>
            <Text>Email: {user?.email}</Text>
            <Button title="Đăng xuất" onPress={logout} />
        </View>
    );
};

export default HomeSuperadmin;
