import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import colors from '../../../Styles/color';
import RenderHTML from 'react-native-render-html';
import Video from 'react-native-video';
import { Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Material } from '../../../Interfaces/Interfaces';

interface MaterialContentProps {
    material: Material;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const MaterialContent = ({ material, onNext, onPrev, hasNext, hasPrev }: MaterialContentProps) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: material.materialName || 'Material details',
        });
    }, [material]);

    const handleComplete = () => {
        setIsCompleted(true);
        Alert.alert("Hoàn thành!", "Bạn đã hoàn thành tài liệu này.");
    };

    const isYouTubeLink = (url: string) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {hasPrev && <TouchableOpacity onPress={onPrev}><Text style={styles.changeButton}>{'<'} Previous</Text></TouchableOpacity>}
                {hasNext && <TouchableOpacity onPress={onNext}><Text style={styles.changeButton}>Next {'>'}</Text></TouchableOpacity>}
            </View>

            <View style={styles.contentBox}>
                {material.contentItems.map((content, index) => (
                    <View key={index} style={styles.contentItem}>

                        {content.type === 'TEXT' ? (
                            <RenderHTML
                                contentWidth={width - 32}
                                source={{ html: content.text || '' }}
                                tagsStyles={htmlTagStyles}
                            />
                        )
                            : content.type === 'VIDEO' && isYouTubeLink(content.url) ? (
                                <View style={{ width: '100%', aspectRatio: 16 / 9, marginVertical: 10 }}>
                                    <WebView
                                        source={{ uri: content.url }}
                                        allowsFullscreenVideo
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            )
                                : content.type === 'VIDEO' ? (
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
                                ) : content.type === 'DOCUMENT' ? (
                                    <WebView
                                        source={{ uri: content.url }}
                                        style={{ width: '100%', height: 400, marginVertical: 10 }}
                                    />
                                ) :
                                    (
                                        <Text style={styles.contentText}>🔗 Nội dung khác: {content.type}</Text>
                                    )}
                    </View>
                ))}
            </View>

            {!isCompleted && material.contentItems.some(item => item.type === 'TEXT' || item.type === 'DOCUMENT') && (
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>Mark as Completed</Text>
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
        backgroundColor: colors.background,
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
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    completeButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    changeButton: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
    }
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
    pre: {
        backgroundColor: '#2D2D2D',
        color: 'white',
        padding: 10,
        borderRadius: 6,
        fontFamily: 'monospace',
    },
    code: {
        color: 'white',
        fontFamily: 'monospace',
    },
    table: {
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tr: {
        flexDirection: 'row' as 'row',
    },
    th: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold' as const,
        flex: 1,
        textAlign: 'left' as const,
    },
    td: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        flex: 1,
        textAlign: 'left' as const,
    },

};
export default MaterialContent;
