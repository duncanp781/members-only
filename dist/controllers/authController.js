"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("@models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const AuthController = {
    get_signup: (req, res, next) => {
        res.render("sign-up", {
            title: "Sign Up",
        });
    },
    post_signup: [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (0, express_validator_1.check)("confirm-password", "Passwords don't match.")
            .exists()
            .custom((value, { req }) => value == req.body.password),
        (req, res, next) => {
            const err = (0, express_validator_1.validationResult)(req);
            if (!err.isEmpty()) {
                res.render('sign-up', {
                    title: "Sign up",
                    errors: err.array(),
                });
            }
            bcryptjs_1.default.hash(req.body.password, 10, (err, hashedPW) => {
                if (err) {
                    return next(err);
                }
                const user = new user_1.default({
                    username: req.body.username,
                    password: hashedPW,
                    clubhouse: false,
                    admin: req.body.admin === "on",
                });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                user.save((err) => {
                    //I can't figure out the typing of this error, 
                    //since it seems like not all mongoose errors have codes.
                    if (err) {
                        if (err.code && err.code === 11000) {
                            res.render("sign-up", {
                                title: "Sign up",
                                errors: [{ "msg": "Username already in use" }],
                            });
                        }
                        return next(err);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    req.login(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.redirect('/');
                    });
                });
            });
        }
    ],
    get_signin: (req, res, next) => {
        res.render("sign-in", {
            title: "Sign in",
        });
    },
    post_signin: passport_1.default.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in",
    }),
    get_signout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    },
};
exports.default = AuthController;
