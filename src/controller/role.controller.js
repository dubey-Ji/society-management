import { Role } from '../models/role.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const roleController = {};

roleController.create = async (req, res) => {
  const { name } = req.body;
  if (name === '') throw new ApiError(400, 'All fields are required');

  const existingRole = await Role.findOne({ name });
  if (existingRole) throw new ApiError(400, 'Role already exist');

  const role = await Role.create({ name });

  const createdRole = await Role.findById(role._id).select('-isActive');
  if (!createdRole)
    throw new ApiError(500, 'Something went wrong while creating role');
  return res
    .status(201)
    .json(new ApiResponse(200, createdRole, 'Role created successfully'));
};

roleController.fetchAllRoles = async (req, res) => {
  const roles = await Role.find({ isActive: true });
  if (roles.length === 0)
    return res.status(400).json(new ApiError(400, 'No roles found'));

  return res
    .status(200)
    .json(new ApiResponse(200, roles, 'Role fetch successfully'));
};
