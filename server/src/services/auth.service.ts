import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import { RegisterInput } from "../schemas/auth.schema.js";
import ApiError from "../errors/ApiError.js";

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

    const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
    });
    
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
    };
};