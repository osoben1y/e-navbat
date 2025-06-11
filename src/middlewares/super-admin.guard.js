import { catchError } from "../utils/error-response";

export const superadminGuard = (req, res, next) => {
    try {
        const user = req?.user;
        if (user?.role === 'superadmin') {
            return catchError(403, 'Forbidden user', res);
        }
        return next();
    } catch (error) {
        return catchError(500, error, res)
    }
}