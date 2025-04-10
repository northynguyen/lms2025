export interface Tag {
    _id: string;
    tagName: string;
    topic: string;
    createdBy: string;
}

export interface Section {
    _id: string;
    name: string;
    orderNumber: number;
    materials: string[];
    duration: number;
}

export interface Course {
    _id: string;
    name: string;
    description: string;
    createdBy: User;
    instructor: User;
    published: boolean;
    prerequisites: string[];
    tags: Tag[];
    image: string;
    price: number;
    discount: number;
    durationInWeeks: number;
    language: string;
    level: string;
    sections: Section[];
    createdAt: string;
    updatedAt: string;
    code: string;
    discountedPrice: number;
}
// Định nghĩa kiểu dữ liệu cho người dùng
export interface User {
    id: string;
    username: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    enrollments: string[];
}

// Tạo Context để lưu trữ token và dữ liệu người dùng
export interface AuthContextType {
    token: string | null;
    user: User | null;
    loading: boolean;
    setAuth: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    url: string;
}

export interface AnimationStatusProps {
    status: 'loading' | 'success' | 'error' | null;
    text?: string;
    onDone?: () => void;
    show?: boolean;
}

export interface ContentItem {
    _id: string;
    type: "VIDEO" | "IMAGE" | "TEXT" | "AUDIO" | "DOCUMENT";
    text?: string;
    url: string;
}

export interface Material {
    _id: string;
    section: string;
    course: string;
    materialType: "ASSIGNMENTS" | "LABS" | "LECTURES" | "REFERENCES" | "ASSESSMENTS";
    materialName: string;
    title: string;
    orderNum: number;
    expectDuration: number;
    wordCount: number;
    contentItems: ContentItem[];
    studyLogs?: string[];
    createdBy: string;
    updatedBy: string;
}
