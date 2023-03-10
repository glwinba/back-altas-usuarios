import jwt from "jsonwebtoken";
import config from "../config.js";
import LoginUser from "../database/models/Login.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await LoginUser.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
