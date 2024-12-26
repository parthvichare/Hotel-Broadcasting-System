const mongoose = require('mongoose');
const { Schema,model } = mongoose;

const GuestRegistrationSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Ensure it's a 10-digit number
  },
  address: {
    type: String,
    required: true,
  },
  purposeOfVisit: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Ensure valid email format
  },
  IdProofNumber: {
    type: String,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelRegister", // Reference to the Hotel schema
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically manage `createdAt` and `updatedAt`
});

const guestregister  =  model("guest", GuestRegistrationSchema)

module.exports = guestregister 
