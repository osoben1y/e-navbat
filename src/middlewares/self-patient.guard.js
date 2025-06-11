import { catchError } from '../utils/error-response.js';

export const selfGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (
      user?.role === 'superadmin' ||
      user?.role === 'admin' ||
      user?.is_doctor ||
      user?.id == req.params?.id
    ) {
      return next();
    }
  } catch (error) {
    return catchError(500, error, res);
  }
};
