import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../Auth/AuthContext';
import Icons from 'react-native-vector-icons/FontAwesome6';
import colors from '../../Styles/color';
import CourseCard from '../Component/CourseCard';
import { Course } from '../../Interfaces/Interfaces';

const filters = ["All", "Beginner", "Intermediate", "Advanced"];
const CoursesScreen: React.FC = () => {
    const { url } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("All");
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const queryParams = new URLSearchParams({ published: "true" });
                const response = await fetch(`${url}/api/course?${queryParams.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data: Course[] = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Icons name="magnifying-glass" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search courses"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <FlatList
                    data={filters}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                selectedFilter === item && styles.selectedFilter,
                            ]}
                            onPress={() => setSelectedFilter(item)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedFilter === item && styles.selectedFilterText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.cardCourses}>
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <CourseCard course={item} customStyle={{ marginBottom: 10, width: "100%" }} />}
                />
            </View>

        </View>
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

export default CoursesScreen;