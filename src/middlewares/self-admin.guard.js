import { catchError } from '../utils/error-response.js';

export const selfAdminGuard = (req, res, next) => {
  try {
    if (user?.role === 'superadmin' || user.id == req.params.id) {
      return next();
    } else {
      return catchError(403, 'Forbidden user', res);
    }
  } catch (error) {
    return catchError(500, error.message, res);
  }
};
