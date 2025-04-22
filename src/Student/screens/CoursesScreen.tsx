import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../Auth/AuthContext';
import Icons from 'react-native-vector-icons/FontAwesome6';
import colors from '../../Styles/color';
import CourseCard from '../Component/CourseCard';
import { Course } from '../../Interfaces/Interfaces';
import AnimationStatus from '../../AnimationStatus/AnimationStatus';
import { useFocusEffect } from '@react-navigation/native';

const filters = ["All", "Beginner", "Intermediate", "Advanced"];

const CoursesScreen = () => {
    const { url, token, user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [statusText, setStatusText] = useState('');
    const searchInputRef = useRef<TextInput>(null);

    useFocusEffect(
        useCallback(() => {
            setStatus('loading');
            setStatusText('Loading...');
            const fetchCourses = async () => {
                try {
                    const response = await fetch(`${url}/api/enrollment`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': `${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch courses');
                    }

                    const data = await response.json();
                    setCourses(data.courses);
                    setStatus(null);
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            };

            fetchCourses();
        }, [url, token])
    );

    const filteredCourses = courses.filter((course) => {
        const matchQuery = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLevel = selectedFilter === "All" || course.level === selectedFilter;
        return matchQuery && matchLevel;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Icons name="magnifying-glass" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        ref={searchInputRef}
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
                            style={[styles.filterButton, selectedFilter === item && styles.selectedFilter]}
                            onPress={() => setSelectedFilter(item)}
                        >
                            <Text
                                style={[styles.filterText, selectedFilter === item && styles.selectedFilterText]}
                            >
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
                {courses.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
                        You have not enrolled in any courses.
                    </Text>
                ) : filteredCourses.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
                        No matching courses found.
                    </Text>
                ) : (
                    <FlatList
                        data={filteredCourses}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CourseCard
                                course={item}
                                customStyle={{ marginBottom: 10, width: "100%" }}
                            />
                        )}
                    />
                )}
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