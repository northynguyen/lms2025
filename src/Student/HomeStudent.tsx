import React, { useEffect, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen.tsx';
import CoursesScreen from './screens/CoursesScreen.tsx';
import MessageScreen from './screens/MessageScreen.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import Icons from 'react-native-vector-icons/FontAwesome6';
import IconChat from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const HomeStudent: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Icons name="house" size={size} color={color} />;
            case 'Courses':
              return <Icons name="book-open" size={size} color={color} />;
            case 'Messages':
              return <IconChat name="chat" size={size} color={color} />;
            case 'Profile':
              return <Icons name="user-large" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeStudent;
