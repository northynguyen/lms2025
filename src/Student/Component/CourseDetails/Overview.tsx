import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Course } from '../../../Interfaces/Interfaces';
import colors from '../../../Styles/color';
import Icons from 'react-native-vector-icons/FontAwesome6';
type OverviewRouteProp = RouteProp<{ Overview: { course: Course } }, 'Overview'>;
const OverviewScreen = () => {
    const route = useRoute<OverviewRouteProp>();
    const { course } = route.params;
    const [expanded, setExpanded] = useState(false);
    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerCourse}>
                        <Text style={styles.title}>{course.name}</Text>
                        <Text style={styles.instructor}>
                            {course.instructor.firstName} {course.instructor.lastName || 'Không rõ'}
                        </Text>
                    </View>
                    <View style={styles.priceView}>
                        <Text style={styles.price}>
                            {course?.discountedPrice ? `${course.discountedPrice} $` : 'Free'}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.description} numberOfLines={expanded ? undefined : 3}>
                        {course.description || 'No description'}
                    </Text>
                    {course.description.length > 100 && (
                        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                            <Text style={styles.readMore}>{expanded ? 'Read Less' : 'Read More'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.benefitsBox}>
                    <View style={styles.benefitItem}>
                        <Icons name="book" size={18} color={colors.primary} />
                        <Text style={styles.benefitText}> 80+ Lectures</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icons name="tag" size={18} color={colors.primary} />
                        <Text style={styles.benefitText}> {course?.discount ? `${course.discount}% Off` : 'No Discount'}</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icons name="hourglass-half" size={18} color={colors.primary} />
                        <Text style={styles.benefitText}> {course?.durationInWeeks || 'Unknown'} Weeks</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icons name="certificate" size={18} color={colors.primary} />
                        <Text style={styles.benefitText}> Certificate</Text>
                    </View>
                </View>
                <Text style={styles.title}>Skills</Text>
                <View style={styles.tagContainer}>
                    {course.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag.tagName}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        flexDirection: 'column',
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerCourse: {
        flexDirection: 'column',
        flex: 2,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
    },
    instructor: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.textPrimary,
        marginVertical: 10,
    },
    priceView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    benefitsBox: {
        backgroundColor: colors.backgroundSecondary,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
    },
    benefitItem: {
        fontSize: 15,
        color: '#555',
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    language: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6c757d',
    },
    readMore: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        rowGap: 10,
    },
    tag: {
        color: colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});

export default OverviewScreen;


