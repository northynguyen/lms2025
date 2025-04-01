import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReviewScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>📚 Welcome to the Review Tab!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18 },
});

export default ReviewScreen;
