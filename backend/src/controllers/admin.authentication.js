import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { query } from "../utils/db.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Query user from database
    const result = await query(`SELECT * FROM admin WHERE email = $1`, [email]);

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    // Verify password
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token (excluding password from token payload)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Set cookie with token
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction, // only true on HTTPS
      sameSite: isProduction ? "None" : "Lax", // "Lax" for dev, "None" for prod
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return success response (without sensitive data)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message || error);
    res
      .status(500)
      .json({ message: "Internal Server Error during auth check." });
  }
};
