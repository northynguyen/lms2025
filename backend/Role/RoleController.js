import { getAllRoles, createRole, updateRole, deleteRole, saveAllRoles } from './RoleService.js';

// Tạo role mới
export const createRoleController = async (req, res) => {
    try {
        const { name } = req.body;
        const newRole = await createRole({ name });
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: 'Role creation failed', error: error.message });
    }
};

// Lấy tất cả roles
export const getAllRolesController = async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Role fetching failed', error: error.message });
    }
};

// Cập nhật role
export const updateRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedRole = await updateRole(id, { name });
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Role update failed', error: error.message });
    }
};

// Xóa role
export const deleteRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRole = await deleteRole(id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found to delete' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Role deletion failed', error: error.message });
    }
};
export const saveAllRolesController = async (req, res) => {
    try {
        const { roles } = req.body;
        const savedRoles = await saveAllRoles(roles);

        res.status(201).json({
            message: 'Roles saved successfully',
            roles: savedRoles,
        });
    } catch (error) {
        res.status(500).json({ message: 'Role saving failed', error: error.message });
    }
};