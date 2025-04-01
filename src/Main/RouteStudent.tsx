import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStudent from '../Student/HomeStudent';
import CourseDetails from '../Student/Component/CourseDetails/CourseDetails';

export type StudentStackParamList = {
    StudentHome: undefined; // Đổi tên tránh trùng
    CourseDetails: { courseId: string };
};

const Stack = createNativeStackNavigator<StudentStackParamList>();

const RouteStudent: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="StudentHome">
            <Stack.Screen
                name="StudentHome"
                component={HomeStudent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CourseDetails"
                component={CourseDetails}
            />
        </Stack.Navigator>
    );
};

export default RouteStudent;
