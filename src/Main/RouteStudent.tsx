import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStudent from '../Student/HomeStudent';
import CourseDetails from '../Student/Component/CourseDetails/CourseDetails';
import MaterialDetails from '../Student/Component/MaterialDetails/MaterialDetails';
import PaymentScreen from '../Student/Component/Payment';
import { Material, Section } from '../Interfaces/Interfaces';
import AllCourse from '../Student/Component/AllCourse';
import QuizzScreen from '../Student/Component/Quizz';

export type StudentStackParamList = {
    StudentHome: undefined;
    CourseDetails: { courseId: string };
    MaterialDetails: { materialData: Material, courseSections: Section[] };
    PaymentScreen: undefined;
    AllCourses: { autoFocusSearch: boolean } | undefined;
    QuizzScreen: undefined
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
            <Stack.Screen name="MaterialDetails" component={MaterialDetails} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: 'Payment Method' }} />
            <Stack.Screen name="AllCourses" component={AllCourse} options={{
                headerTitle: "All Courses",
                headerShadowVisible: false,
            }} />
            <Stack.Screen name="QuizzScreen" component={QuizzScreen} />
        </Stack.Navigator>
    );
};

export default RouteStudent;
