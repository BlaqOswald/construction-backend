"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowRoles = void 0;
const allowRoles = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied",
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                message: "Role middleware error",
            });
        }
    };
};
exports.allowRoles = allowRoles;
