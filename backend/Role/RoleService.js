import Role from './Role.js';

// Lấy tất cả các Role
export const getAllRoles = async () => await Role.find();

// Tìm Role theo ID
export const getRoleById = async (id) => await Role.findById(id);

// Tạo mới Role
export const createRole = async (data) => {
    const newRole = new Role(data);
    return await newRole.save();
};

// Cập nhật Role theo ID
export const updateRole = async (id, data) =>
    await Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });

// Xóa Role theo ID
export const deleteRole = async (id) => await Role.findByIdAndDelete(id);

// Lưu nhiều roles vào database
export const saveAllRoles = async (roles) => {
    try {
        if (!Array.isArray(roles) || roles.length === 0) {
            throw new Error('Role list is not valid.');
        }
        const roleDocs = roles.map((role) => ({ name: role }));
        return await Role.insertMany(roleDocs);
    } catch (error) {
        throw new Error(`Role list saving failed: ${error.message}`);
    }
};

