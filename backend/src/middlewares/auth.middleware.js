

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.get("Authorization")?.replace("Bearer ", "");

        

        // Log token info for debugging in development environment
        if (process.env.NODE_ENV === "development") {
            console.log("Extracted Token:", token);
        }

       
        // If token is missing, throw an error
        if (!token) {
            if (process.env.NODE_ENV === "development") {
                console.log("No token found. Headers:", req.headers);
                console.log("Cookies:", req.cookies);
            }
            throw new ApiError(401, "Unauthorized: Missing or malformed token.");
        }

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (process.env.NODE_ENV === "development") {
            console.log("Decoded Token:", decodedToken);
        }

        // Find user by the decoded ID and check if the account is verified
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If the user is not found or account is unverified, throw an error
        if (!user || !user.accountVerified) {
            if (process.env.NODE_ENV === "development") {
                console.log("User not found or account unverified.");
            }
            throw new ApiError(401, "Unauthorized: Invalid or unverified token.");
        }

        // Attach user to request object for further use in route handlers
        req.user = user;
        next();
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error verifying token:", error);
        }

        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Unauthorized: Invalid or malformed token.");
        }

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized: Token expired.");
        }

        // Fallback error
        throw new ApiError(401, "Unauthorized: Invalid access token.");
    }
});


