export const userController = {};
import { User } from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Role } from '../models/role.models.js';
import { uploadFileAtCloudinary } from '../utils/cloudinary.js';
import { readFileFromExcel } from '../utils/xlsx-utils.js';

userController.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const { flatNo, bldgName } = req.body.address;
  if (
    ([name, email, password, bldgName].some((field) => field?.trim() === '') &&
      [phoneNumber, flatNo].some((field) => field === null)) ||
    req.body.roles.length === 0
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(400, 'User already exist');

  const roles = await Role.find({});
  const rolesId = roles
    .filter((r) => {
      return req.body.roles.includes(r.name.toLowerCase()) && r.isActive;
    })
    .map((r) => r._id);

  if (rolesId.length !== req.body.roles.length || rolesId.length === 0)
    throw new ApiError(400, 'Roles not found');

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password,
    address: { flatNo, bldgName },
    roles: rolesId,
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

userController.fetchAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .populate('roles')
    .select('-password -refreshToken');

  if (users.length === 0)
    return res.status(400).json(new ApiError(400, 'No users found'));

  return res.status(200).json(new ApiResponse(200, users, 'All User fetched'));
});

userController.login = asyncHandler(async (req, res) => {
  try {
    // take login creds from FE
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new ApiError(400, 'Invalid User credentials');

    const isPasswordValid = existingUser.isPasswordCorrect(password); // isPasswordCorrect method is define in user model, you cannot use User.isPasswordCorrect
    if (!isPasswordValid) throw new ApiError(400, 'Invalid User Credentials');

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loogedInUser = await User.findOne({ email })
      .populate('roles')
      .select('-password -refreshToken');

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loogedInUser, accessToken, refreshToken },
          'User logged in successfully'
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || 'Something went wrong');
  }
});

userController.logout = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(200, {}, 'User logged out successfully'));
  } catch (error) {
    throw new ApiError(400, error?.message || 'Something went wrong');
  }
});

// TODO: Create a controller through which you can take xls file of users to be register

// userController.registerUserWithXlsx = asyncHandler(async (req, res) => {
//   // upload file to localpath - which will be done by multer middleware in route only
//   // take localpaht and upload to cloudinary
//   // read the data from file and register user in db
//   // after successfull user registeration unlink the file from local
//   // maintain a file collection to keep record of all the uploaded file for registering users
//   const localPath = req.files.users[0].path;
//   // const files = await uploadFileAtCloudinary(localPath, { unlink: false });
//   // console.log(req.files);
//   // console.log(files);

//   const data = readFileFromExcel(localPath);
//   console.log(data);
//   return res.status(200).json(new ApiResponse(200, {}, 'Success'));
// });
