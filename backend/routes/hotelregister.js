const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel'); 
const GuestRegistration = require('../models/guestRegistration'); 
const path = require("path")
const multer = require("multer")
const fs = require("fs")
const QRCode = require("qrcode")

  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Use original file name or create a unique one
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Initialize multer
const upload = multer({ storage });

// Handle the registration route
router.post("/register-hotel", upload.single('logo'), async (req, res) => {
    const { hotelname, address } = req.body;
    
    let logoFilename;

    // Check if logo is provided as a file upload
    if (req.file) {
        logoFilename = req.file.filename; // Get the uploaded logo filename
    } else if (req.body.logo) { // Check for Base64 logo string
        try {
            // Decode Base64 string
            const base64Data = req.body.logo.split(',')[1]; // Get the Base64 data
            const buffer = Buffer.from(base64Data, 'base64');

            // Create an upload directory if it doesn't exist
            const uploadDir = path.join(__dirname, "../uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Save the file with a timestamped name
            logoFilename = `${Date.now()}-logo.png`;
            const filePath = path.join(uploadDir, logoFilename);

            // Write the file
            await fs.promises.writeFile(filePath, buffer);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to save logo from Base64.' });
        }
    } else {
        return res.status(400).json({ message: 'Logo is required.' });
    }

    try {
        // Create a new hotel entry in the database
        const newHotel = await Hotel.create({
            hotelname,
            address,
            logo: logoFilename, // Save the filename to the database
        });

        res.status(201).json({
            message: 'Hotel registered successfully',
            hotel: newHotel,
        });
    } catch (error) {
        console.error("Error registering hotel:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to get a hotel by ID
router.get("/api/:id", async (req, res) => {
    try {
      const hotelId = req.params.id;
      const qrCodeURL = `http://localhost:3000/hotel/${hotelId}`;
      const qrCodeFilePath = `./QRCode/${hotelId}.png`;
  
      console.log("QR Code URL:", qrCodeURL);
  
      // Generate QR Code and save to file
      await QRCode.toFile(qrCodeFilePath, qrCodeURL);
  
      const qrCodeData = fs.readFileSync(qrCodeFilePath, { encoding: "base64" });
  
      // Update the hotel record in the database with QR code
      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId,
        { hotelQRCODE: qrCodeData }, // Save QR code as Base64 in the hotel document
        { new: true } // Return updated document
      );
  
      if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
  
      console.log("Updated Hotel Info:", updatedHotel);
      res.json(updatedHotel);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });



router.patch("/:id", async (req, res) => {
    try {
        // Extract data from request body
        const { hotelname, address, _id } = req.body;

        const updatedHotel = await Hotel.findByIdAndUpdate(_id,{ hotelname, address },  { new: true});

        res.status(200).json({
            message: "Hotel updated successfully",
            data: updatedHotel,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            message: "Error updating hotel",
            error: error.message,
        });
    }
});

router.get("/allhotels", async(req,res)=>{
    try{
        const allhotels =  await Hotel.find({})
        return res.json(allhotels)
    }catch(error){
        console.log(error.message)
    }
})

// Route to delete a hotel by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
