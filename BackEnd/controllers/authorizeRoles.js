const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
        }

        const userRole = String(req.admin.role || "").toLowerCase();

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    };
};

module.exports = authorizeRoles;