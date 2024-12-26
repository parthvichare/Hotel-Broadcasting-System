const { Schema, model } = require("mongoose");

const HotelRegisterSchema = new Schema(
  {
    hotelname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    hotelQRCODE: {
      type: String,
      required: false, // Since it is provided, making it required
    },
    guests: [
      {
        type: Schema.Types.ObjectId,
        ref: "guest",
      },
    ],
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` automatically
);

const Hotel = model("HotelRegister", HotelRegisterSchema);

module.exports = Hotel;
