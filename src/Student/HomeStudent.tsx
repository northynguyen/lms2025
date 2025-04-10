import React, { useEffect, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen.tsx';
import CoursesScreen from './Screens/CoursesScreen.tsx';
import MessageScreen from './Screens/MessageScreen.tsx';
import SettingsScreen from './Screens/SettingScreen.tsx';
import NotionScreen from './Screens/NotionScreen.tsx';
import Icons from 'react-native-vector-icons/FontAwesome6';
import IconChat from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../Styles/color.ts';
const Tab = createBottomTabNavigator();

const HomeStudent = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Hiển thị tiêu đề trên header
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Icons name="house" size={size} color={color} />;
            case "Courses":
              return <Icons name="book-open" size={size} color={color} />;
            case "Messages":
              return <IconChat name="chat" size={size} color={color} />;
            case "Notions":
              return <Icons name="bell" size={size} color={color} solid />;
            case "Settings":
              return <Icons name="bars" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerTitle: "FPT Software LMS", }} />
      <Tab.Screen name="Courses" component={CoursesScreen} options={{
        headerTitle: "My Courses", headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Notions" component={NotionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>

  );
};

export default HomeStudent;
