import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '../../Auth/AuthContext';
import Icons from 'react-native-vector-icons/FontAwesome6';
import colors from '../../Styles/color';
import CourseCard from '../Component/CourseCard';
import { Course } from '../../Interfaces/Interfaces';
import { RouteProp } from '@react-navigation/native';
import { StudentStackParamList } from '../../Main/RouteStudent';
import AnimationStatus from '../../AnimationStatus/AnimationStatus';

const filters = ["All", "Beginner", "Intermediate", "Advanced"];

const AllCourse = ({ route }: { route: RouteProp<StudentStackParamList, 'AllCourses'> }) => {
    const { url } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const searchInputRef = useRef<TextInput>(null);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        if (route?.params?.autoFocusSearch) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 300);
        }
    }, [route]);

    useEffect(() => {
        fetchSearchCourses(searchQuery, selectedFilter);
    }, [searchQuery, selectedFilter]);

    const fetchSearchCourses = async (query: string, level: string) => {
        setStatus('loading');
        try {
            const queryParams = new URLSearchParams({
                query,
                page: '1',
                limit: '10',
            });
            if (level !== 'All') {
                queryParams.append('level', level);
            }

            const response = await fetch(`${url}/api/course/search?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch courses');

            const data = await response.json();
            setCourses(data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setStatus(null);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Search courses"
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Icons name="magnifying-glass" size={20} color="#999" style={styles.searchIcon} />
                    </View>
                    <FlatList
                        data={filters}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.filterButton, selectedFilter === item && styles.selectedFilter]}
                                onPress={() => setSelectedFilter(item)}
                            >
                                <Text style={[styles.filterText, selectedFilter === item && styles.selectedFilterText]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.cardCourses}>
                    <AnimationStatus
                        status={status}
                        text={statusText}
                        onDone={() => setStatus(null)}
                        show={!!status}
                    />
                    <FlatList
                        data={courses}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CourseCard course={item} customStyle={{ marginBottom: 10, width: "100%" }} />
                        )}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No courses found.</Text>}
                    />

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, flexDirection: 'column', gap: 20 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 10,
        height: 50,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: colors.background,
    },
    selectedFilter: {
        backgroundColor: "#FFEDE3",
    },
    filterText: {
        fontSize: 14,
        color: "#666",
    },
    selectedFilterText: {
        color: "#FF6600",
        fontWeight: "bold",
    },
    cardCourses: { flex: 1, padding: 16, backgroundColor: colors.backgroundSecondary },
    header: { flexDirection: 'column', gap: 10, alignItems: 'center' },
});

export default AllCourse;