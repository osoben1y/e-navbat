import { model, Schema } from 'mongoose';

const patientSchema = new Schema(
  {
    fullName: { type: String },
    phoneNumber: { type: String, unique: true },
    hashedPassword: { type: String },
    address: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

patientSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patientId',
});

const Patient = model('Patient', patientSchema);
export default Patient;
