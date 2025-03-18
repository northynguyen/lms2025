import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../Auth/AuthContext';

const ProfileScreen: React.FC = () => {
    const { logout, user } = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User Profile</Text>
            <Button title="Đăng xuất" onPress={logout} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 24, fontWeight: 'bold' },
});

export default ProfileScreen;
