import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StudentStackParamList } from '../../../Main/RouteStudent';
import { Material } from '../../../Interfaces/Interfaces';
import MaterialContent from './MaterialContent';

const MaterialDetails = () => {
    const route = useRoute<RouteProp<StudentStackParamList, 'MaterialDetails'>>();
    const { materialData, courseSections } = route.params;
    const [currentMaterial, setCurrentMaterial] = useState<Material>(materialData);

    // Tạo một danh sách materials đã sắp xếp theo thứ tự của sections và orderNum
    const getFlattenedSortedMaterials = () => {
        return courseSections
            .flatMap(section =>
                section.materials.map(material => ({
                    ...material,
                    section: section._id,
                    sectionOrder: section.orderNumber ?? 0, // nếu có
                }))
            )
            .sort((a, b) => {
                if (a.sectionOrder === b.sectionOrder) {
                    return a.orderNum - b.orderNum;
                }
                return a.sectionOrder - b.sectionOrder;
            });
    };

    const findNextMaterial = () => {
        const allMaterials = getFlattenedSortedMaterials();
        const currentIndex = allMaterials.findIndex(m => m._id === currentMaterial._id);
        return allMaterials[currentIndex + 1] || null;
    };

    const findPreviousMaterial = () => {
        const allMaterials = getFlattenedSortedMaterials();
        const currentIndex = allMaterials.findIndex(m => m._id === currentMaterial._id);
        return allMaterials[currentIndex - 1] || null;
    };

    return (
        <MaterialContent
            material={currentMaterial}
            onNext={() => {
                const next = findNextMaterial();
                if (next) setCurrentMaterial(next);
            }}
            onPrev={() => {
                const prev = findPreviousMaterial();
                if (prev) setCurrentMaterial(prev);
            }}
            hasPrev={!!findPreviousMaterial()}
            hasNext={!!findNextMaterial()}
        />
    );
};

export default MaterialDetails;
