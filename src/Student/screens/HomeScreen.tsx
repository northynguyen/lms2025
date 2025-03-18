import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';



const HomeScreen: React.FC = () => {
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
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Home Student</Text>
        </View>
    )
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 24, fontWeight: 'bold' },
});

export default HomeScreen;
