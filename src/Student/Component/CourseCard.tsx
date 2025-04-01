import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Styles/color';
import { StackNavigationProp } from '@react-navigation/stack';
import { StudentStackParamList } from '../../Main/RouteStudent';
import { Course } from '../../Interfaces/Interfaces';


const CourseCard: React.FC<{ course: Course, customStyle?: ViewStyle }> = ({ course, customStyle }) => {
    type NavigationProp = StackNavigationProp<StudentStackParamList, 'CourseDetails'>;
    const navigation = useNavigation<NavigationProp>();
    const handlePress = () => {
        navigation.navigate("CourseDetails", { courseId: course._id });
    };

    const discountedPrice = course.price * (1 - course.discount / 100);

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.courseCard, customStyle]}>
            <View style={{ flexDirection: 'column', gap: 10 }}>
                <Image source={{ uri: course.image }} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                    <Text style={[styles.level,
                    course.level === "Beginner" ? styles.beginnerLevel :
                        course.level === "Intermediate" ? styles.mediumLevel :
                            styles.hardLevel
                    ]}>{course.level}</Text>
                    <Text style={styles.courseName}>{course.name} ({course.code})</Text>
                    <Text style={styles.courseInstructor}>{course.createdBy.firstName} {course.createdBy.lastName}</Text>
                    <Text style={styles.courseDuration}>{course.durationInWeeks} weeks</Text>
                </View>
            </View>
            {course.discount > 0 ? (
                <View style={styles.priceContainer}>
                    <Text style={styles.discountedPrice}>{discountedPrice.toFixed(2)} $</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.oldPrice}>{course.price} $</Text>
                        <Text style={styles.discountPercent}>-{course.discount}%</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.coursePrice}>{course.price > 0 ? `$${course.price}` : "Free"}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    courseCard: {
        backgroundColor: colors.background,
        borderRadius: 10,
        marginRight: 10,
        width: 280,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    courseImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    courseInfo: {
        flexDirection: 'column',
        gap: 6,
        paddingHorizontal: 10,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    courseInstructor: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    courseDuration: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    oldPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
        marginRight: 6,
    },
    discountedPrice: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.error,
        marginRight: 6,
    },
    discountPercent: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.error,
        backgroundColor: colors.error + '30',
        padding: 2,
    },
    coursePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textSecondary,
        padding: 10,
        textAlign: 'right',
    },
    beginnerLevel: {
        color: colors.success,
        borderWidth: 1,
        borderColor: colors.success,
        backgroundColor: colors.success + '30',
    },
    mediumLevel: {
        color: colors.accent,
        borderWidth: 1,
        borderColor: colors.accent,
        backgroundColor: colors.accent + '30',
    },
    hardLevel: {
        color: colors.error,
        borderWidth: 1,
        borderColor: colors.error,
        backgroundColor: colors.error + '30',
    },
    level: {
        fontSize: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
    },
});

export default CourseCard;
