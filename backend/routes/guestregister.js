const express = require("express")
const guestregister = require("../models/guestRegistration")
const router =  express.Router()
const Hotel = require('../models/hotel'); 



router.post("/guest", async (req, res) => {
    console.log(req.body)
    try {
      const {
        fullName,
        mobileNumber,
        address,
        purposeOfVisit,
        checkIn,
        checkOut,
        emailId,
        IdProofNumber,
        hotel,
      } = req.body;

  
      const registerGuest = {
        fullName,
        mobileNumber,
        address,
        purposeOfVisit,
        checkIn,
        checkOut,
        emailId,
        IdProofNumber,
        hotel,
      };
  
      const registeredGuest = await guestregister.create(registerGuest);
      console.log(registeredGuest._id)
      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotel,
        { $push: { guests: registeredGuest._id } }, // Add guest ID to the hotel's guests array
        { new: true } // Return the updated document
      );
      res.status(201).json({ message: "Guest registered successfully", data: {registeredGuest,updatedHotel} });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ message: "Validation failed", error: error.message });
    }
  });


router.get("/guest_info/:id", async(req,res)=>{
  // console.lo
  try{
    const guestInfo =  await guestregister.findById(req.params.id)
    return res.json(guestInfo)
  }catch(error){
    console.log(error.message)
  }
})
  

router.patch("/guest_update/:id", async (req, res) => {
    console.log("Hello")
    try {
        const { id } = req.params; // Extract the guest ID from the route parameters
        const updatedData =  req.body

        // Find the guest by ID and update their details
        const updatedGuest = await guestregister.findByIdAndUpdate(
            id, 
            updatedData, 
            { new: true} // Return updated document and validate updates
        );

        res.status(200).json({ message: "Guest updated successfully", data: updatedGuest });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Failed to update guest", error: error.message });
    }
});



router.get("/guestdetail",async(req,res)=>{
  console.log("Guest details")
  try{
    const allGuest =  await guestregister.find().populate("hotel")
    return res.json(allGuest)
  }catch(error){
    console.log(error.message)
  }
})


router.delete("/guest_delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the guest ID from the route parameters

        // Find the guest by ID and delete their record
        const deletedGuest = await guestregister.findByIdAndDelete(id);

        // Check if the guest exists
        if (!deletedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        res.status(200).json({ message: "Guest deleted successfully", data: deletedGuest });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: "Failed to delete guest", error: error.message });
    }
});


module.exports  =  router;