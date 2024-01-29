import { Request, Response, NextFunction } from "express";
import {
  hashPassword,
  comparePassword,
  isValidEmail,
  verifyPhoneNumberAndMail,
  sendVerificationMail,
  sendEmail,
} from "../helpers/authHelper";
import userModel from "../models/userModel";
import JWT from "jsonwebtoken";
import otpModel from "../models/tokenModel";
import RoleModel from "../models/roleModel";
import tokenModel from "../models/tokenModel";
import UserModel from "../models/userModel";

const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { firstName, lastName, name, email, password } = req.body;

    // validation
    if (!firstName) {
      return res.status(400).send({ message: "FirstName is Required" });
    }
    if (!lastName) {
      return res.status(400).send({ message: "Lastname is Required" });
    }
    if (!name) {
      return res.status(400).send({ message: "Username is Required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Required" });
    }
    const isEmail: boolean = await isValidEmail(email);
    if (!isEmail) {
      return res.status(400).send({ message: "Please Enter Correct Email" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email Already Registered Please Login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password); 

    const role = await RoleModel.find({ role: "User" });

    // save
    const user = await new userModel({
      firstName,
      lastName,
      name,
      email,
      password: hashedPassword,
      roles: role,
    }).save();

    // verifyPhoneNumberAndMail(name, email, phone);

    res.status(200).send({
      success: true,
      message: "User Successfully Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
const registerAdminController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { firstName, lastName, name, email, password } = req.body;

    // validation
    if (!firstName) {
      return res.status(400).send({ message: "FirstName is Required" });
    }
    if (!lastName) {
      return res.status(400).send({ message: "Lastname is Required" });
    }
    if (!name) {
      return res.status(400).send({ message: "Username is Required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Required" });
    }
    const isEmail: boolean = await isValidEmail(email);
    if (!isEmail) {
      return res.status(400).send({ message: "Please Enter Correct Email" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email already Registered please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);

    const role = await RoleModel.find({});

    // save
    const user = await new userModel({
      firstName,
      lastName,
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      roles: role,
    }).save();

    // verifyPhoneNumberAndMail(name, email, phone);

    res.status(200).send({
      success: true,
      message: "Admin Successfully Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// Post Login
const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //email validation
    const isEmail = await isValidEmail(email);
    if (!isEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Please Enter Correct Email" });
    }

    // check user
    const user = await userModel.findOne({ email }).populate("roles", "role");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const { roles } = user;
    // console.log(roles);

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(403).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token
    const jwt_secret_key: string = process.env.JWT_SECRET || "";
    const token = await JWT.sign(
      { _id: user._id, isAdmin: user.isAdmin, roles: roles },
      jwt_secret_key,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("access_token", token, { httpOnly: true }).status(200).send({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const listDataController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Fetch all documents from the collection
    const users: any[] = await userModel.find({}, { name: 1 }).exec();

    // Extract names from the retrieved documents
    const names: string[] = users.map((user) => user.name);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Fetching data",
      error,
    });
  }
};

const updateDataController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  //email validation
  if (updatedUserData.email) {
    const isEmail = await isValidEmail(updatedUserData.email);
    if (!isEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Please Enter Correct Email" });
    }
  }

  if (userId.length != 24) {
    return res.status(400).json({ message: "ID is not of specified length" });
  }

  try {
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (updatedUserData.password) {
      const hashedPassword = await hashPassword(updatedUserData.password);
      updatedUserData.password = hashedPassword;
    }
    const role = await RoleModel.find({ role: updatedUserData.role });
    existingUser.firstName =
      updatedUserData.firstName || existingUser.firstName;
    existingUser.lastName = updatedUserData.lastName || existingUser.lastName;
    existingUser.name = updatedUserData.name || existingUser.name;
    existingUser.email = updatedUserData.email || existingUser.email;
    existingUser.profileImage =
      updatedUserData.profileImage || existingUser.profileImage;
    // existingUser.roles = role || existingUser.roles;
    // existingUser.phone = updatedUserData.phone || existingUser.phone;
    // existingUser.address = updatedUserData.address || existingUser.address;
    // existingUser.gender = updatedUserData.gender || existingUser.gender;
    // existingUser.hobbies = updatedUserData.hobbies || existingUser.hobbies;

    // Save updated user data
    await existingUser.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", user: existingUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteDataController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;

    // Validate the user ID format
    if (userId.length !== 24) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if the user exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    const deletedUser = await userModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyDataController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.body;

  try {
    const user = await userModel.findById(_id);
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isMailVerified === true && user.isPhoneVerified == true) {
      return res
        .status(201)
        .json({ message: "User Email and Phone number already verified." });
    }
    sendVerificationMail(user);

    return res
      .status(200)
      .json({ message: "OTP and Verification mail sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendEmailController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    // console.log(req.body);

    
    const isEmail = await isValidEmail(email);
    if (!isEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Please Enter Correct Email" });
    }
    // check user
    const user = await userModel.findOne({ email });

    // existing user
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Email is not Registered, Please Register",
      });
    }
    const payload = {
      email: user.email,
    };
    const expiryTime = 10;
    const jwt_secret_key: string = process.env.JWT_SECRET || "";
    const token: string = JWT.sign(payload, jwt_secret_key, {
      expiresIn: expiryTime,
    });

    const newToken = new tokenModel({
      _id: user._id,
      token: token,
    });

    sendEmail(user, token);
    newToken.save();
    return res.status(200).json({ message: "Mail sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPaswordController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token, password } = req.body;

  try {
    const jwt_secret_key: string = process.env.JWT_SECRET || "";
    JWT.verify(token, jwt_secret_key, async (err: any, data: any) => {
      if (err) {
        await tokenModel.deleteOne({token});
        return res.status(500).json({ message: "Reset Link has Expired" });
      } else {
        const response = data;
        const user = await userModel.findOne({ email: response.email });
        if (!user) {
          return res
            .status(400)
            .json({ message: "User doesnt exist, might be deleted" });
        }
        const hashedPassword: string = await hashPassword(password);
        user.password = hashedPassword;

        user.save();

        await tokenModel.findByIdAndDelete(user._id);

        return res.status(200).json({ message: "Password Reset Successful" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export {
  registerController,
  loginController,
  verifyDataController,
  listDataController,
  updateDataController,
  deleteDataController,
  registerAdminController,
  sendEmailController,
  resetPaswordController,
};
