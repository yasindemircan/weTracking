const jwt = require('jsonwebtoken');
const { router } = require('../app');

module.exports = (req,res,next)=>{
    const token = req.body.token || req.query.token;
    
  //  var tokenh =  req.headers['x-access-token'];
   // console.log("token:",req.body);
    if(token){
        jwt.verify(token,req.app.get('api_secret_key'),(err, decoded)=>{
            if(err){
                res.status(401).json({success:false,message: 'Hatalı Token Kodu'});
            }else {
                req.decode = decoded;
               // console.log("log",req.decode)
                next();
            }
        })
    }else {
        res.status(403).json({success:false,message: 'Token kodu bulunamdı.'});
    }
};

