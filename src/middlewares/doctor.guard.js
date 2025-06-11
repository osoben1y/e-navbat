import { catchError } from '../utils/error-response.js';

export const DoctorGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (
      user?.role === 'superadmin' ||
      user?.role === 'admin' ||
      user?.is_doctor
    ) {
      return next();
    }
    return catchError(403, 'Forbidden user', res);
  } catch (error) {
    catchError(500, error.message, res);
  }
};
