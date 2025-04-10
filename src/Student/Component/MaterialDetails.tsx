import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { Material } from '../../Interfaces/Interfaces';
import colors from '../../Styles/color';
import RenderHTML from 'react-native-render-html';
import Video from 'react-native-video';
import { Image } from 'react-native';
// import { WebView } from 'react-native-webview'; không sử dụng được vì chưa có phiên bản phù hợp với react native 0.78
const MaterialDetails = () => {
    const route = useRoute();
    const { materialData } = route.params as { materialData: Material };
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerTitle: materialData.materialName || 'Chi tiết tài liệu' });
    }, [navigation, materialData.materialName]);

    const handleComplete = () => {
        setIsCompleted(true);
        Alert.alert("Hoàn thành!", "Bạn đã hoàn thành tài liệu này.");
    };
    const isYouTubeLink = (url: string): boolean => {
        if (!url) return false;
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
        return pattern.test(url);
    };
    return (
        <ScrollView style={styles.container}>
            {/* Tiêu đề */}
            <Text style={styles.subtitle}>{materialData.title}</Text>

            {/* Thông tin chung */}
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>📘 Loại: {materialData.materialType}</Text>
                <Text style={styles.infoText}>📌 Số thứ tự: {materialData.orderNum}</Text>
                <Text style={styles.infoText}>⏳ Thời gian dự kiến: {materialData.expectDuration} phút</Text>
                <Text style={styles.infoText}>📄 Số từ: {materialData.wordCount}</Text>
            </View>

            {/* Nội dung tài liệu */}
            <Text style={styles.sectionTitle}>Nội dung</Text>
            <View style={styles.contentBox}>
                {materialData.contentItems.map((content, index) => (
                    <View key={index} style={styles.contentItem}>
                        {content.type === 'TEXT' ? (
                            <RenderHTML
                                contentWidth={width - 32}
                                source={{ html: content.text || '' }}
                                tagsStyles={htmlTagStyles}
                            />
                        ) : content.type === 'VIDEO' && isYouTubeLink(content.url) ? (
                            <View style={{ height: 220, marginVertical: 10 }}>
                                {/* <WebView
                                    source={{ uri: content.url }}
                                    allowsFullscreenVideo
                                    style={{ flex: 1 }}
                                /> */}
                            </View>
                        ) : content.type === 'VIDEO' ? (
                            <View style={{ width: '100%', aspectRatio: 16 / 9, marginVertical: 10 }}>
                                <Video
                                    source={{ uri: content.url }}
                                    style={{ width: '100%', height: '100%' }}
                                    controls
                                    resizeMode="contain"
                                />
                            </View>
                        ) : content.type === 'IMAGE' ? (
                            <Image
                                source={{ uri: content.url }}
                                style={{ width: '100%', height: 400, marginVertical: 10, borderRadius: 8 }}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.contentText}>🔗 Nội dung khác: {content.type}</Text>
                        )}
                    </View>
                ))}
            </View>

            {/* Tiến trình học tập */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    {isCompleted ? "✅ Đã hoàn thành" : "⏳ Chưa hoàn thành"}
                </Text>
            </View>

            {/* Nút đánh dấu hoàn thành */}
            {!isCompleted && (
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>✅ Đánh dấu hoàn thành</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 26,
        color: colors.textPrimary,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#444',
    },
    infoBox: {
        backgroundColor: colors.backgroundSecondary,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    infoText: {
        fontSize: 15,
        color: colors.textPrimary,
        width: '48%',
    },
    contentBox: {
        backgroundColor: '#eef3f7',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    contentItem: {
        marginBottom: 8,
    },
    contentText: {
        fontSize: 16,
        color: '#333',
    },
    progressContainer: {
        padding: 12,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        marginVertical: 12,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00796b',
        textAlign: 'center',
    },
    completeButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    completeButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
const htmlTagStyles = {
    h1: {
        fontSize: 26,
        fontWeight: 'bold' as const,
        color: '#1a1a1a',
        marginBottom: 12,
        marginTop: 16,
    },
    h2: {
        fontSize: 22,
        fontWeight: 'bold' as const,
        color: '#2b2b2b',
        marginBottom: 10,
        marginTop: 14,
    },
    p: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 10,
    },
    ul: {
        paddingLeft: 20,
        marginBottom: 10,
    },
    ol: {
        paddingLeft: 20,
        marginBottom: 10,
    },
    li: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 6,
    },
    strong: {
        fontWeight: 'bold' as const,
    },
};
export default MaterialDetails;
