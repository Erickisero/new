const express =require ('express');
const createHttpError = require('http-errors');
const Student = require('../models/students');
const Login = require("../models/login");
const {authSchema} = require('../auth/auth_schema');
const routes = express.Router();
const createError = require('http-errors');
const {signAccessToken, signRefreshToken}= require ('../auth/jwthelper');
const { VerifyAccessToken } = require ('../auth/jwthelper');
require('dotenv').config();
 //get a list of studentd from dsts base
 routes.get('/students',(req,res)=>{
   Student.find({}).then((student)=> {
      res.send(student);
   });
 });
  //add student to db
 routes.post('/students',(req, res, next)=>{
   Student.create(req.body).then((student)=>{
      res.send(student);
   }).catch(next);
 });
 routes.delete('/students/:id',(req, res, next)=>{
   Student.findByIdAndRemove({_id:req.params.id}).then((
      student=>{
         res.send(student);
      }));
 })
 //update students db
 routes.put('/students/:id',(res,req,next)=>{
   Student.findByIdAndUpdate({_id:req.params.id},req.body).then(()=>{
      Student.findOne({_id:req.params.id}).then((student)=>{
         res.send(student);
      });
   });
 })
 //register user
 routes.post('/register',async( req, res, next)=>
 {
   try{
      const{email, password}= req.body;
      const result=await authSchema.validateAsync(req.body);
      const exists = await Login.findOne({email: email});
      if (exists) throw createError.Conflict(`${email} has already been registered`);
      const login = new Login(result);
      const savedLogin = await login.save();
      const accessToken = await signAccessToken(savedLogin.id);
      const refreshToken = await signRefreshToken(savedLogin.id);
      res.send({refreshToken});
      res.send({accessToken});
      
   }catch (error){
      next(error);
   }
 })
  //login user 
  routes.post('/login',VerifyAccessToken,async(req, res, next)=>
  {
    try{
       const result = await authSchema.validateAsync(req.body);
       const login = await Login.findOne({email: result.email});
       if (!login) throw createError.NotFound('User Not Registered');
      
       const isMatch = await login.isValidPassword(result.Password);
       if(!isMatch) throw createError.Unauthorized('Username/Password is Not Valid');
 
       const accessToken = await signAccessToken(login.id);
       const refreshToken = await signRefreshToken(login.id);
       //res.send(savedLogin);
       res.send({accessToken, refreshToken});
       
    }catch (error){
       if(error.isJoi === true)
        return next(createError.BadRequest('Invalid username/Password'));
       next(error);
    }
  })
 module.exports = routes;