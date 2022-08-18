import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import "dotenv/config";

import express from "express";
import "express-async-errors";

import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { indexRouter } from "./routes/routes";

import User, { IUser } from "@models/user";
import Post from "@models/post";

import mongoose from "mongoose";
import { ConnectionOptions } from "tls";

import bcrypt from 'bcryptjs';

// Constants
const app = express();
/***********************************************************************************
 *                                  DB Setup
 **********************************************************************************/
//Not sure why, but the connectionoptions doesn't have these options.
mongoose.connect(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectionOptions);
const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on("error", console.error.bind(console, "mongo connection error"));

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

/***********************************************************************************
 *                                  Passport Setup
 **********************************************************************************/
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne(
      { username: username },
      (err: Error | null, user: IUser | null) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: "Incorrect Username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if(err){
            return done(err, false);
          }
          if (res) {
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
      }
    );
  })
);

// Apparently express.user type doesn't have id, so I'm not sure what the type is here.
passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err: Error | null, user: IUser | null) {
    done(err, user);
  });
});

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Passport middleware to give us access to user
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})


/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set views
app.set("view engine", "pug");
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static dir
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Serve index.html file
app.use("/", indexRouter);

// Export here and start in a diff file (for testing).
export default app;
