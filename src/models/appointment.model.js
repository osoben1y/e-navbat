import { model, Schema } from 'mongoose';

const appointmentSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
    complaint: { type: String },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    graphId: { type: Schema.Types.ObjectId, ref: 'Graph' },
  },
  { timestamps: true }
);

export const Appointment = model('Appointment', appointmentSchema);
export default Appointment;
