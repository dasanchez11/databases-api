const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()


const createToken = (user) =>{
  // Sign the JWT
  if (!user.clientRole) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
      iss: 'api.logistics',
      aud: 'api.logistics'
    },
    process.env.SECRET_KEY,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};



const verifyPassword = (
  passwordAttempt,
  hashedPassword
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

const createDiscount = (type,price,cuantity) =>{
  if(!type){
    throw new Error('No type specified')
  }
  if(cuantity>5){
    if(type==='sea') return price*0.03
    if(type==='land') return price*0.02
  }else 
  return 0
}

const createGuideNumber = () =>{
  return String(new Date().valueOf()).substring(3,13)
}

const validateFields = (registerDate,deliveryDate,guideNumber,fleetNumber,transportType) =>{
  const register = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(registerDate)
  const delivery = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(deliveryDate)
  const guide = /^[0-9]{10}$/.test(guideNumber)

  let vehicle = false
  if(transportType==='sea'){
    vehicle = /^[a-zA-Z]{3}[0-9]{4}[a-zA-Z]{1}$/.test(fleetNumber)
  }else if(transportType==='land'){
    vehicle = /^[a-zA-Z]{3}[0-9]{3}$/.test(fleetNumber)
  }

  if(register&&delivery&&guide&&vehicle){
    return true
  }else{
    return false
  }
}

  module.exports = {
    createToken,
    verifyPassword,
    createDiscount,
    createGuideNumber,
    validateFields
  }