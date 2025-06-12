import Appointment from '../models/appointment.model.js';
import { appointmentValidator } from '../validation/appointment.validation.js';
import { catchError } from '../utils/error-response.js';

export class AppointmentController {
  async createAppointment(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        return catchError(400, error.message, res);
      }
      const appointment = await Appointment.create(value);
      return res.status(201).json({
        statusCOde: 201,
        message: 'success',
        data: appointment,
      });
    } catch (error) {
      return catchError(500, error.message, res);
    }
  }

  async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.find()
        .populate('patientId')
        .populate('graphId');
      if (!appointments.length) {
        return catchError(404, 'Appointments not found', res);
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: appointments,
      });
    } catch (error) {
      return catchError(500, error.message, res);
    }
  }

  async getAllAppointmentById(req, res) {
    try {
      const data = await Appointment.findById(req.params.id);
      if (!data) {
        return catchError(404, 'Appointment not found', res);
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: data,
      });
    } catch (error) {
      return catchError(500, error.message, res);
    }
  }

  async updateAppointment(req, res) {
    try {
      const data = await Appointment.findByIdAndUpdate(req.params.id, {
        new: true,
      });
      if (!data) {
        return catchError(404, 'Appointment not found', res);
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: data,
      });
    } catch (error) {
      return catchError(500, error.message, res);
    }
  }

  async deleteAppointment(req, res) {
    try {
      const data = await Appointment.findByIdAndDelete(req.params.id);
      if (!data) {
        return catchError(404, 'Appointment not found', res);
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(500, error.message, res);
    }
  }
}
