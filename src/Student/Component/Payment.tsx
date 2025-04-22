import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const PaymentScreen = () => {
    const pdfUrl = 'https://res.cloudinary.com/lms2025/raw/upload/v1743645718/course_materials/movuhxyoqdgf8kg3qerj.docx';
    const googleViewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: googleViewer }}
                style={styles.webview}
                startInLoadingState={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 400, width: '100%' },
    webview: { flex: 1 },
});

export default PaymentScreen;
