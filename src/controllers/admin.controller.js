import Admin from '../models/admin.model.js';
import { adminValidator } from '../validation/admin.validation.js';
import { catchError } from '../utils/error-response.js';
import { decode, encode } from '../utils/bcrypt-encrypt.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-tokens.js';
import { transporter } from '../utils/mail-sender.js';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otp-generator.js';
import { setCache, getCache } from '../utils/cache.js';
import { writeToCookie } from '../utils/cookie.js';
import logger from '../utils/logger/logger.js';

export class AdminController {
  async createSuperAdmin(req, res) {
    try {
      const data = await Admin.findOne({ role: 'superadmin' });
      if (data) {
        return catchError(409, 'Superadmin already exists', res);
      }
      const { error, value } = adminValidator(req.body);
      if (error) {
        return catchError(406, error, res);
      }
      const { username, password } = value;
      const hashedPassword = await decode(password, 7);
      const superadmin = await Admin.create({
        username,
        hashedPassword,
        role: 'superadmin',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: superadmin,
      });
    } catch (error) {
      catchError(500, error, res);
    }
  }

  async createAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        return catchError(406, error, res);
      }
      const { username, password } = value;
      const hashedPassword = await decode(password, 7);
      const admin = await Admin.create({
        username,
        hashedPassword,
        role: 'admin',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: admin,
      });
    } catch (error) {
      catchError(500, error, res);
    }
  }

  async signinAdmin(req, res) {
    try {
      const { username, passwor } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return catchError(404, 'Admin not found', res);
      }
      const matchPassword = await encode(password, admin.hashedPassword);
      if (!matchPassword) {
        return catchError(400, 'Invalid password', res);
      }
      const otp = generateOTP();
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: 'e-navbat',
        text: otp,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          return catchError(500, `Error sending to mail: ${err}`, res);
        } else if (info) {
          setCache(admin.username, otp);
        }
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {}
      })
    } catch (error) {
      catchError(500, error, res);
    }
  }

  async verifyAdmin(req, res){
    try {
        const { username, otp } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin){
            return catchError(404, 'Admin not found', res);
        }
        const payload = { id: admin._id, role: admin.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        writeToCookie(res, 'refreshToken', refreshToken);
        return res.status(200).json({
            statusCode: 200,
            message: 'success',
            data: accessToken
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }

  async getAccessToken (req, res){
    try {
        const refreshToken = req.cookie.refreshTokenAdmin;
        if (!refreshToken){
            return catchError(401, 'Unauthorized', res);
        }
        const decodedData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
        );
        if(!decodedData){
            return catchError(401, 'token expired', res);
        }
        const payload = { id: decodedData.id, role: decodedData.role };
        const accessToken = generateAccessToken(payload);
        return res.status(200).json({
            statusCode:200,
            message: 'success',
            data:accessToken
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }

  async signoutAdmin(req, res){
    try {
        const refreshToken = req.cookie.refreshTokenAdmin;
        if(!refreshToken){
            return catchError(401, 'Unauthorized', res);
        }
        const decodedData = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_KEY
        )
        if (!decodedData) {
            return catchError(401, 'Token expired', res);
        }
        res.clearCookie('refreshTokenAdmin');
        return res.status(200).json({
            statusCode:200,
            message: 'success',
            data: {}
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }

  async geatAllAdmins(req, res){
    try {
        const admins = await Admin.findAll();
        if (!admins || admins.length === 0){
            return catchError(404, 'Admins not found', res);
        }
        return res.status(200).json({
            statusCode: 200,
            message: 'success',
            data: admins
        })
    } catch (error) {
      catchError(500, error, res);
    }
  }

  async getAdminById(req, res){
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin){
            return catchError(404, 'Admin not found', res);
        }
        return res.status(200).json({
            statusCode:200,
            message: 'success',
            data: admin
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }

  async updateAdminById(req, res){
    try {
        const updateAdminById = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateAdminById) {
            return catchError(404, 'Admin not found', res);
        }
        return res.status(200).json({
            statusCode:200,
            message: 'success',
            data: updateAdminById
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }

  async deleteAdminById(req, res){
    try {
        const deleteAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deleteAdmin){
            return catchError(404, 'Admin not found', res);
        }
        return res.status(200).json({
            statusCode:200,
            message: 'success',
            data: {}
        })
    } catch (error) {
        catchError(500, error, res);
    }
  }
}
