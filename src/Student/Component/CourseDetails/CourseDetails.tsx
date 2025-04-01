import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LessonScreen from './Lesson';
import OverviewScreen from './Overview';
import ReviewScreen from './Review';
import AnimationStatus from '../../../AnimationStatus/AnimationStatus';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StudentStackParamList } from '../../../Main/RouteStudent';
import { useAuth } from '../../../Auth/AuthContext';

import { Course } from '../../../Interfaces/Interfaces';
import colors from '../../../Styles/color';

type CourseDetailsRouteProp = RouteProp<StudentStackParamList, 'CourseDetails'>;
const Tab = createMaterialTopTabNavigator();

const CourseDetails = () => {
    const route = useRoute<CourseDetailsRouteProp>();
    const navigation = useNavigation();
    const { courseId } = route.params;
    const { url } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [status, setStatus] = useState<'loading' | 'error' | 'success' | null>('loading');
    const [statusText, setStatusText] = useState<string>('Đang tải...');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`${url}/api/course/${courseId}`);
                if (!response.ok) throw new Error('Lỗi khi tải khóa học');
                const data = await response.json();
                setCourse(data);
                setStatus(null);
                navigation.setOptions({ headerTitle: data.name || 'Chi tiết khóa học' });
            } catch (error) {
                setStatus('error');
                setStatusText('Lỗi khi tải khóa học');
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [courseId, navigation, url]);

    if (!course) {
        return (
            <AnimationStatus status={status} text={statusText} onDone={() => setStatus(null)} show={!!status} />
        );
    }
    return (
        <View style={styles.container}>
            <AnimationStatus status={status} text={statusText} onDone={() => setStatus(null)} show={!!status} />
            <Image source={{ uri: course.image }} style={styles.image} />
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: colors.background },
                    tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
                    tabBarIndicatorStyle: { backgroundColor: colors.primary },
                }}
            >
                <Tab.Screen name="Overview" component={OverviewScreen} initialParams={{ course }} />
                <Tab.Screen name="Lesson" component={LessonScreen} />
                <Tab.Screen name="Review" component={ReviewScreen} />
            </Tab.Navigator>

            <TouchableOpacity style={styles.button} onPress={() => console.log('Start Course')}>
                <Text style={styles.buttonText}>GET ENROLL</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textPrimary,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    courseId: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});

export default CourseDetails;
