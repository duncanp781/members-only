import User from "@models/user";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { check, validationResult } from "express-validator";

const AuthController: any = {
  get_signup: (req: Request, res: Response, next: NextFunction) => {
    res.render("sign-up", {
      title: "Sign Up",
    });
  },

  post_signup: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    check(
      "confirm-password",
      "Passwords don't match."
    )
      .exists()
      .custom((value, { req }) => value == req.body.password),
    (req: Request, res: Response, next: NextFunction) => {
      const err = validationResult(req);
      if (!err.isEmpty()){
        res.render('sign-up', {
          title: "Sign up",
          errors: err.array(),
        })
      }
    bcrypt.hash(req.body.password as string, 10, (err, hashedPW) => {
      if (err) {
        return next(err);
      }
      const user: any = new User({
        username: req.body.username,
        password: hashedPW,
        clubhouse: false,
        admin: req.body.admin === "on",
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      user.save((err: any) => {
        //I can't figure out the typing of this error, 
        //since it seems like not all mongoose errors have codes.
        if (err) {
          if (err.code && err.code === 11000) {
            res.render("sign-up", {
              title: "Sign up",
              errors: [{"msg": "Username already in use"}],
            });
          }
          return next(err);
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.login(user, function(err){
          if(err){return next(err);}
          return res.redirect('/')
        });
      });
    });
  }
  ],

  get_signin: (req: Request, res: Response, next: NextFunction) => {
    res.render("sign-in", {
      title: "Sign in",
    });
  },

  post_signin: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  }),

  get_signout: (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
};
export default AuthController;
