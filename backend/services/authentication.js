const JWT= require("jsonwebtoken")

const secret=process.env.JWT_Secret_Key;


// createTokenForUser= Its used for when the User Login and the Token is generated where its kind of Encode & Decode which means that server will Enocde the User_data and stored as JWT token!
function createTokenForUser(user){
    const payload={
        id:user._id,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    }

    const token= JWT.sign(payload,secret)
    return token
}


// When the server receives a token from the client, it calls validateToken(token).
// ValidateToken:- When user logIn its send the cookie to the NodeJS server the server will validate with MongoDb with the cookie and will decoded  according to the user Info!
function validateToken(token){
    const payload= JWT.verify(token,secret);
    console.log(payload)
    return payload
}

module.exports={
    createTokenForUser,
    validateToken,
}
