import User from "@models/user";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs'

const Controller = {
  get_index: (req: Request, res: Response, next: NextFunction) => {
    res.render('index', {
      title: "Index",
      message: "Test",
    });
  },

  get_signup: (req: Request, res: Response, next: NextFunction) => {
    res.render('sign-up', {
      title: "Sign Up",
    })
  },

  post_signup: (req: Request, res: Response, next: NextFunction) => {

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      clubhouse: false,
    }).save(err => {
      if (err){
        return next(err);
      }
      res.redirect('/');
    })
    // bcrypt.hash(req.body.password as string, 10, (err, hashedPW) => {
    //   if(err){
    //     return next(err);
    //   }
    //   const user = new User({
    //     username: req.body.username,
    //     password: hashedPW,
    //     clubhouse: false,
    //   }).save(err => {
    //     if (err){
    //       return next(err);
    //     }
    //     res.redirect('/')
    //   })
    // })
    
  },
};
export default Controller;
