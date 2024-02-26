export const userController = {};
import { User } from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// userController.registerUser = async (req, res) => {
//   // res.status(200).json({ message: 'Success' });
//   // validate if all the fields require are present or not
//   // validate if user already exist
//   // create user if not exist
//   // return response after successfull creation
//   const { name, email, phoneNumber, password } = req.body;
//   const { flatNo, bldgName } = req.body.address;
//   const user = await User.findOne({ email: email });
//   if (user) return res.status(400).json({ message: 'User already exist' });
//   await User.create({
//     name,
//     email,
//     phoneNumber,
//     password,
//     address: { flatNo, bldgName },
//   });
//   res.status(201).json({ message: 'User register successfully' });
// };

userController.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const { flatNo, bldgName } = req.body.address;
  if (
    [name, email, password, bldgName].some((field) => field?.trim() === '') &&
    [phoneNumber, flatNo].some((field) => field === null)
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(400, 'User already exist');

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password,
    address: { flatNo, bldgName },
    roles: ['Owner'],
  });
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser)
    throw new Error(500, 'Something went wrong while registering user');
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Register successfully'));
});
