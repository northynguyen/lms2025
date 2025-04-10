import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcom to the Payment Tab</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18 },
});

export default PaymentScreen;
