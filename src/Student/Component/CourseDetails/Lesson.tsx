import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import Icons from "react-native-vector-icons/FontAwesome6";
import { Course, Section, Material } from "../../../Interfaces/Interfaces";
import { useAuth } from "../../../Auth/AuthContext";
import colors from "../../../Styles/color";
import { StackNavigationProp } from "@react-navigation/stack";
import { StudentStackParamList } from "../../../Main/RouteStudent";

type OverviewRouteProp = RouteProp<{ Overview: { course: Course } }, 'Overview'>;

const LessonScreen = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [materialsCache, setMaterialsCache] = useState<{ [key: string]: Material[] }>({});
    const { url } = useAuth();

    const route = useRoute<OverviewRouteProp>();
    const { course: courseData } = route.params;
    type NavigationProp = StackNavigationProp<StudentStackParamList, 'MaterialDetails'>;
    const navigation = useNavigation<NavigationProp>();
    useEffect(() => {
        if (courseData) {
            setCourse(courseData);
        }
    }, [courseData]);

    const fetchMaterials = async (section: Section) => {
        if (materialsCache[section._id]) return; // Nếu có cache thì không fetch lại

        try {
            const materialsData = await Promise.all(
                section.materials.map(id =>
                    fetch(`${url}/api/material/${id}`).then(res => res.json())
                )
            );
            setMaterialsCache(prev => ({ ...prev, [section._id]: materialsData }));
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const toggleSection = (section: Section) => {
        setExpandedSections(prev => {
            if (prev.includes(section._id)) {
                return prev.filter(id => id !== section._id); // Đóng section
            } else {
                fetchMaterials(section); // Mở section -> Fetch materials nếu cần
                return [...prev, section._id];
            }
        });
    };
    const handleMaterialPress = (material: Material) => {
        navigation.navigate("MaterialDetails", { materialData: material });
    };
    const getMaterialIcon = (type: string) => {
        switch (type) {
            case "ASSIGNMENTS": return "clipboard-list";
            case "LABS": return "flask";
            case "LECTURES": return "chalkboard-user";
            case "REFERENCES": return "book";
            case "ASSESSMENTS": return "file-contract";
            default: return "file";
        }
    };

    const renderSectionItem = ({ item }: { item: Section }) => {
        const isExpanded = expandedSections.includes(item._id);
        const materials = materialsCache[item._id] || [];

        return (
            <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={() => toggleSection(item)} style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Chapter {item.orderNumber}: {item.name}</Text>
                    <Icons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} />
                </TouchableOpacity>

                {isExpanded && (
                    <FlatList
                        data={materials.sort((a, b) => a.orderNum - b.orderNum)}
                        keyExtractor={(material) => material._id}
                        renderItem={({ item: material }) => (
                            <TouchableOpacity style={styles.materialItem} onPress={() => handleMaterialPress(material)}>
                                <Icons
                                    name={getMaterialIcon(material.materialType)}
                                    size={20}
                                    color={colors.primary}
                                />
                                <Text>{material.materialName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={course?.sections.sort((a, b) => a.orderNumber - b.orderNumber)}
                keyExtractor={(item) => item._id}
                renderItem={renderSectionItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: colors.background,
        flex: 1
    },
    sectionContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        borderRadius: 8,
        padding: 12,
        backgroundColor: colors.backgroundSecondary,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    materialItem: {
        marginTop: 8,
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
});

export default LessonScreen;
