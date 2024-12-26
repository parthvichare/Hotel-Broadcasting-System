import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const Allhotels = () => {
  const [allhotels, setAllhotels] = useState([]);

  useEffect(() => {
    const fetchhotelData = async () => {
      try {
        const response = await axiosInstance.get("/hotel/allhotels");
        setAllhotels(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchhotelData();
  }, []);

  const mappedhotels = allhotels.map((hotel) => {
    // Ensure hotel.hotelQRCode exists before trying to access it
    const qrCodeSrc = hotel.hotelQRCODE && typeof hotel.hotelQRCODE === 'string' 
      ? hotel.hotelQRCODE.startsWith("data:image/")
        ? hotel.hotelQRCODE
        : `data:image/png;base64,${hotel.hotelQRCODE}`
      : ''; // Fallback to an empty string if undefined or not a string
  
    return {
      id: hotel._id,
      name: hotel.hotelname,
      qrCodeSrc: qrCodeSrc,
    };
  });  

  console.log("Mapped Hotels:", mappedhotels);

  return (
    <div>
      {mappedhotels.map((item) => (
        <div key={item.id}>
          <a href={`/hotel/${item.id}`}>
          <h1>{item.name}</h1>
          </a>
          {item.qrCodeSrc ? (
            <img src={item.qrCodeSrc} alt={`QR Code for ${item.name}`} />
          ) : (
            <p>No QR code available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Allhotels;
