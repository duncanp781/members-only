import User from "@models/user";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { check } from "express-validator";

const AuthController: any = {
  

  get_signup: (req: Request, res: Response, next: NextFunction) => {
    res.render("sign-up", {
      title: "Sign Up",
    });
  },

  post_signup: (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    check(
      "confirm-password",
      "password and confirmation password must have the same value"
    )
      .exists()
      .custom((value, { req }) => value == req.body.password);
    bcrypt.hash(req.body.password as string, 10, (err, hashedPW) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPW,
        clubhouse: false,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },

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
