  
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    if (req.method == "POST"){
        const authHeader = req.get('Authorization');
        if(!authHeader){
            req.isAuth = false;
            return next();
        }
        const token = authHeader.split(' ')[1];
        if(!token || token === ''){
            req.isAuth = false;
            return next();
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret");
        } catch (error) {
            req.isAuth = false;
            return next();
        }
        if(!decodedToken){
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.username = decodedToken.name;
        next();

    } else { // no authorization GET & PUT
        next();
    }
    
   
    
    
}