import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new ApiError(401, 'Unathorized access');

    const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_KEY);
    if (!decodedToken) throw new ApiError(401, 'Invalid access token');

    const user = await User.findById(decodedToken._id).select(
      '-password -refreshToken'
    );
    if (!user) throw new ApiError(401, 'Unathorized access');

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || 'Invalid access token');
  }
});
