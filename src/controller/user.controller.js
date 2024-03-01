export const userController = {};
import { User } from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Role } from '../models/role.models.js';
import { uploadFileAtCloudinary } from '../utils/cloudinary.js';
import { readFileFromExcel } from '../utils/xlsx-utils.js';
import _ from 'lodash';
import { File } from '../models/file.models.js';

const validateRole = async (userRoles) => {
  const roles = await Role.find({ isActive: true });
  const rolesName = _.map(roles, 'name');
  let isRoleValid = true;
  for (let i = 0; i < userRoles.length; i++) {
    if (!rolesName.includes(userRoles[i])) {
      isRoleValid = false;
      break;
    }
  }
  return isRoleValid;
};

userController.registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, file } = req.body || req; // this controller is used to register user using excel also
  const { flatNo, bldgName } = req.body?.address || req.address; // this controller is used to register user using excel also
  const rolesName = req.body?.roles || req.roles;
  if (
    ([name, email, password, bldgName].some((field) => field?.trim() === '') &&
      [phoneNumber, flatNo].some((field) => field === null)) ||
    rolesName.length === 0
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(400, 'User already exist');

  const roles = await Role.find({});
  const rolesId = roles
    .filter((r) => {
      return rolesName.includes(r.name.toLowerCase()) && r.isActive;
    })
    .map((r) => r._id);

  // Not required anymore as we are checking if all the roles passed by user is valid or not in validateRole function
  // if (rolesId.length !== (req.body?.roles.length || rolesId.length === 0)
  //   throw new ApiError(400, 'Roles not found');

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password,
    address: { flatNo, bldgName },
    roles: rolesId,
    file: file || null,
  });
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser)
    throw new ApiError(500, 'Something went wrong while registering user');
  if (!res) {
    return { success: true };
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Register successfully'));
};

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

function formatUserDataFromExcel(usersList) {
  const data = [];
  usersList.forEach((user) => {
    let obj = {};
    obj['name'] = user.name;
    obj['email'] = user.email;
    obj['phoneNumber'] = user.phoneNumber;
    obj['password'] = user.password;
    obj['address'] = {};
    obj['address']['flatNo'] = user.flatNo;
    obj['address']['bldgName'] = user.bldgName;
    obj['roles'] = user.roles.slice(1, -1).split(', '); // converting string '[owner, chairman]' into array ['owner', 'chairman']
    data.push(obj);
  });
  return data;
}

function checkFileStatus(filePromises) {
  let successCount = 0;
  let rejectedCount = 0;
  for (let i = 0; i < filePromises.length; i++) {
    if (filePromises[i].status === 'fulfilled') {
      successCount += 1;
    } else if (filePromises[i].status === 'rejected') {
      rejectedCount += 1;
    }
  }

  if (successCount === filePromises.length) {
    return 'success';
  } else if (rejectedCount === filePromises.length) {
    return 'failed';
  } else if (rejectedCount > 0) {
    return 'partial success';
  }
}

async function createErrorFile(data, dataPromise) {
  try {
    for (let i = 0; i < dataPromise.length; i++) {
      if (dataPromise[i].status === 'rejected') {
        data[i].status = 'rejected';
        data[i].reason = dataPromise[i].reason;
      }
    }
    console.log(data);
    return;
  } catch (error) {
    // console.error(error?.message);
    throw new ApiError(
      400,
      error?.message || 'Something went wrong while creating error file'
    );
  }
}

userController.registerUserWithXlsx = asyncHandler(async (req, res) => {
  let fileModel;
  try {
    const localPath = req.files.users[0].path;
    const data = readFileFromExcel(localPath);
    const files = await uploadFileAtCloudinary(localPath, { unlink: true });

    fileModel = await File.create({
      url: files.secure_url,
      fileName: files.original_filename,
      status: 'processing',
    });
    const sheetName = Object.keys(data);
    // this can be done only when sheet length is 1
    const usersData = formatUserDataFromExcel(data[sheetName[0]]);

    const promises = [];
    usersData.forEach((user) => {
      user.file = fileModel._id;
      promises.push(userController.registerUser(user));
    });
    const usersPromise = await Promise.allSettled(promises);

    const fileStatus = checkFileStatus(usersPromise);
    fileModel['status'] = fileStatus;

    if (fileStatus === 'failed' || fileStatus === 'partial success') {
      await createErrorFile(usersData, usersPromise);
    } else if (fileStatus === 'success') {
      await fileModel.save();
    }

    return res.status(200).json(new ApiResponse(200, {}, 'Success'));
  } catch (error) {
    fileModel.status = 'failed';
    await fileModel.save();
    throw new ApiError(
      400,
      error?.message || 'Something went wrong while registering user'
    );
  }
});
