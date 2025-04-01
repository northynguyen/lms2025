import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../Styles/color';
import { AnimationStatusProps } from '../Interfaces/Interfaces';


const AnimationStatus: React.FC<AnimationStatusProps> = ({ status, text, onDone, show = true }) => {
    const [visible, setVisible] = useState(show);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    useEffect(() => {
        setVisible(show);
        fadeAnim.setValue(1); // Reset animation mỗi khi trạng thái thay đổi
    }, [show, status]);

    useEffect(() => {
        if (status === 'error' || status === 'success') {
            const timer = setTimeout(handleClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Chọn animation theo trạng thái
    const getAnimationSource = () => {
        switch (status) {
            case 'loading':
                return require('../../assets/loading.json');
            case 'success':
                return require('../../assets/sucess.json');
            case 'error':
                return require('../../assets/error.json');
            default:
                return null;
        }
    };

    const handleClose = () => {
        if (!visible) return;
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            if (onDone) onDone();
        });
    };



    if (!visible || !status) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {status && (
                <LottieView
                    source={getAnimationSource()}
                    autoPlay
                    loop={status === 'loading'}
                    style={styles.animation}
                />
            )}
            <Text style={styles.text}>{text || getDefaultText(status)}</Text>

            {status === 'success' && (
                <TouchableOpacity style={styles.button} onPress={handleClose}>
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

// Text mặc định theo trạng thái
const getDefaultText = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
        case 'loading':
            return 'Đang xử lý...';
        case 'success':
            return 'Thành công!';
        case 'error':
            return 'Có lỗi xảy ra!';
        default:
            return '';
    }
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 9999,
    },
    animation: {
        width: 275,
        height: 275,
    },
    text: {
        marginTop: 0,
        fontSize: 25,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    button: {
        marginTop: 10,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 25,
    },
});

export default AnimationStatus;
