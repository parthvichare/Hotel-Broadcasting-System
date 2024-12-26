const express = require("express")
const router =  express.Router()
const Admin  = require("../models/admin")


router.get("/admin", async(req,res)=>{
    res.send("Hello Admin Route")
})


router.post("/api/signUp", async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // Check if user already exists
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            // Return error response if user already exists
            console.log("User already exists:", existingUser);
            return res.status(400).json({ userexist: "User already exists" });
        }

        // Create new user if doesn't exist
        const newAdmin = await Admin.create({
            name,
            email,
            role,
            password // You should hash the password before storing
        });

        // Return success message with user ID
        return res.status(201).json({ newAdmin, message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/api/signIn",async(req,res)=>{
    console.log("Body",req.body)
    try{
        const{email,password}=req.body;
        const token = await Admin.matchPasswordAndGenerateToken(email,password)
        const admin = await Admin.findOne({email})
        return res.json({
            Loginstatus:"Login Successfully",
            token:token,
            Admin:{
                id:admin.id,
                email:admin.email,
                firstname:admin.firstname,
                role:admin.role
            }
        })
    }catch(error){
        return res.json({
            error:"Invalid email & password"
        })
    }
})

module.exports  =  router;