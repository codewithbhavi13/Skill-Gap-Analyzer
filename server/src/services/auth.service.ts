import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import type {
  RegisterInput,
  LoginInput,
} from "../schemas/auth.schema.js";
import ApiError from "../errors/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerUser = async (
  data: RegisterInput
) => {
    const existingUser = await User.findOne({
        email: data.email,
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    
    let user;

    try {
      user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ApiError(
          409,
          "User with this email already exists"
        );
      }

      throw error;
    }

    
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
    };
};


export const loginUser = async (
  data: LoginInput
) => {
  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  return {
    accessToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  };
};
