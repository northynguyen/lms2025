import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LessonScreen from './Lesson';
import OverviewScreen from './Overview';
import ReviewScreen from './Review';
import AnimationStatus from '../../../AnimationStatus/AnimationStatus';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { StudentStackParamList } from '../../../Main/RouteStudent';
import { useAuth } from '../../../Auth/AuthContext';

import { Course, User } from '../../../Interfaces/Interfaces';
import colors from '../../../Styles/color';

type CourseDetailsRouteProp = RouteProp<StudentStackParamList, 'CourseDetails'>;
const Tab = createMaterialTopTabNavigator();

const CourseDetails = () => {
    const route = useRoute<CourseDetailsRouteProp>();
    const navigation = useNavigation<NavigationProp<StudentStackParamList>>();
    const { courseId } = route.params;
    const { url, token, setAuth, user } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [status, setStatus] = useState<'loading' | 'error' | 'success' | null>('loading');
    const [statusText, setStatusText] = useState<string>('Đang tải...');
    const isEnrolled = course && user?.enrollments.some(
        (enrollment) => enrollment.course === course._id
    );
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

    const handlePaymentPress = async () => {
        try {
            if (course.price > 0) {
                navigation.navigate("PaymentScreen");
                return;
            }
            setStatus('loading');
            setStatusText('Enrolling...');
            const response = await fetch(`${url}/api/enrollment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                body: JSON.stringify({ courseId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Enrollment failed');
            const updatedEnrollments = [...(user?.enrollments || []), data];
            if (token && user) {
                const updatedUser: User = {
                    ...user,
                    enrollments: updatedEnrollments,
                };
                await setAuth(token, updatedUser);
            } else {
                console.error('Token or user is null, cannot update auth state');
            }
            setStatus('success');
            setStatusText('Enrolled successfully!');
        } catch (error) {
            setStatus('error');
            setStatusText(error instanceof Error ? error.message : 'Enrollment failed');
        }
    };
    const handleStudyNow = () => {
        console.log('Study now');
    }
    return (
        <View style={styles.container}>
            <AnimationStatus status={status} text={statusText} onDone={() => setStatus(null)} show={!!status} />
            <Image source={{ uri: course.image }} style={styles.image} />
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: colors.background },
                    tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold', color: colors.primary },
                    tabBarIndicatorStyle: { backgroundColor: colors.primary },
                }}
            >
                <Tab.Screen name="Overview" component={OverviewScreen} initialParams={{ course }} />
                <Tab.Screen name="Lesson" component={LessonScreen} initialParams={{ course }} />
                <Tab.Screen name="Review" component={ReviewScreen} />
            </Tab.Navigator>
            {isEnrolled ? (
                <TouchableOpacity style={styles.buttonStudy} onPress={handleStudyNow}>
                    <Text style={styles.buttonText}>STUDY NOW</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.buttonEnroll} onPress={handlePaymentPress}>
                    <Text style={styles.buttonText}>GET ENROLL</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        marginBottom: 20,
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
    buttonEnroll: {
        backgroundColor: colors.primary,
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonStudy: {
        backgroundColor: colors.warning,
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    }
});

export default CourseDetails;
