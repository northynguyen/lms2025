import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../Interfaces/Interfaces';



const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth phải được sử dụng trong AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [url] = useState('http://10.0.2.2:4000');

    // ✅ Lưu token và user vào AsyncStorage + State
    const setAuth = async (newToken: string, newUser: User) => {
        try {
            await AsyncStorage.setItem('authToken', newToken);
            await AsyncStorage.setItem('userData', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.error('Lỗi khi lưu token hoặc user:', error);
        }
    };

    // ✅ Xóa token và user khi logout
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    // ✅ Kiểm tra trạng thái đăng nhập khi mở ứng dụng
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                const storedUser = await AsyncStorage.getItem('userData');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin đăng nhập:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, setAuth, logout, url }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;