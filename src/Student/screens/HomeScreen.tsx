import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    BackHandler,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Auth/AuthContext';
import Icons from 'react-native-vector-icons/FontAwesome6';
import colors from '../../Styles/color';
import CourseCard from '../Component/CourseCard';
import { Course } from '../../Interfaces/Interfaces';
import { StackNavigationProp } from '@react-navigation/stack';
import { StudentStackParamList } from '../../Main/RouteStudent';
const announcements = [
    { id: '1', title: 'New Course Available: Flutter Fundamentals', date: '3/20/2025' },
    { id: '2', title: 'System Maintenance: March 25th', date: '3/19/2025' },
];

const HomeScreen = () => {
    const { user, url } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [greeting, setGreeting] = useState('');
    type NavigationProp = StackNavigationProp<StudentStackParamList, 'AllCourses'>;
    const navigation = useNavigation<NavigationProp>();
    const handleAllCourses = () => {
        navigation.navigate("AllCourses");
    };
    const handleSearch = () => {
        navigation.navigate("AllCourses", { autoFocusSearch: true });
    };
    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning';
            if (hour < 18) return 'Good Afternoon';
            return 'Good Evening';
        };
        setGreeting(getGreeting());
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${url}/api/course`);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);
    useFocusEffect(
        useCallback(() => {
            const handleBackPress = () => {
                Alert.alert('Confirm Exit', 'Are you sure you want to exit the application?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }, [])
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{greeting},</Text>
                        <Text style={styles.username}>{user?.firstName} {user?.lastName}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.searchButton]}
                        onPress={handleSearch}
                    >
                        <Icons name="magnifying-glass" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Courses Section */}
                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>New Courses</Text>
                        <TouchableOpacity onPress={handleAllCourses}>
                            <Text style={styles.viewAll}>View All →</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={courses}
                        horizontal
                        keyExtractor={(item) => item._id}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <CourseCard course={item} />}
                    />
                </View>

                {/* Announcements Section */}
                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Announcements</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All →</Text>
                        </TouchableOpacity>
                    </View>
                    {announcements.map((item) => (
                        <View key={item.id} style={styles.announcementCard}>
                            <Text style={styles.announcementText}>{item.title}</Text>
                            <Text style={styles.announcementDate}>{item.date}</Text>
                        </View>
                    ))}

                </View>
                <TouchableOpacity onPress={() => navigation.navigate("QuizzScreen")}><Text>text đầu vào</Text></TouchableOpacity>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.backgroundSecondary,
        padding: 16,
        flexDirection: 'column',
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    greeting: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    username: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        height: 50,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 10,
        fontSize: 16,
        color: colors.textPrimary,
    },
    searchButtonInput: {
        marginLeft: 10,
        padding: 14,
        borderRadius: 12,
    },
    searchButton: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: colors.background,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    viewAll: {
        color: colors.accent,
        fontWeight: 'bold',
        fontSize: 14,
    },
    announcementCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    announcementText: {
        fontSize: 14,
        color: '#333',
    },
    announcementDate: {
        fontSize: 12,
        color: '#666',
    },
});

export default HomeScreen;