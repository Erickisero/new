const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const login = require ('../models/login');
const { create } = require('../models/students');
module.exports = {
    signAccessToken:(loginId)=>{
        return new Promise ((resolve, reject)=>{
            const payload ={}
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options ={
                expiresIn: '1h',
                issuer:"spartansTechnologies",
                audience: loginId,
            }
            JWT.sign(payload, secret, options,(error, token)=>{
                if(error) reject (error);
                resolve(token);
            })
        })
    },
    //midleware to access verify Token
    VerifyAccessToken:(res, req, next)=>{
        if(!req.header['authorization']) return next(createError.Unauthorized());
        const authHeader = req.header['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.Verify(token, process.env.ACCESS_TOKEN_SECRET,(err, payload)=>{
            if(err){
                return next (createError.Unauthorized());
            }
            req.payload =payload;
            next()
        })
    },
    signRefreshToken:(loginId)=>{
        return new Promise((resolve, reject)=>{
            const payload ={}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options ={
                expiresIn: '1y',
                issuer: 'spartansTechnologies',
                audience: loginId,
            }
            JWT.sign(payload, secret, options,(error,token)=>{
                if(error) reject(error);
                resolve(token);
            });
        });
    },

};
