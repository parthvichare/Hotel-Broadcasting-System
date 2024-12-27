const express = require("express");
const app = express();
const connectDB = require("./Database/connectdb")
const Admin =  require("./models/admin")
const adminregister  =  require("./routes/adminregister")
const guestregister =  require("./routes/guestregister")
const hotelregister =  require("./routes/hotelregister")
const path =  require("path")
const cookieParser=require("cookie-parser")

const cors = require('cors');

const {validateToken} =  require("./services/authentication")

const {checkForAuthenticationCookie} = require("./authentication")

app.use(cors({
    origin: [
      "http://localhost:3000",  // for local development
    ],
    methods: ["GET","PATCH","DELETE","PUT"],
    credentials: true,
  }));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.json({ limit: '10mb' }));
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectDB()

// Start the server on port 8000
const PORT = 8000;

app.get("/", async(req,res)=>{
    res.json("Hello Admin Route")
})


app.use("/admin", adminregister)
app.use("/guest", guestregister)
app.use("/hotel", hotelregister)


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
