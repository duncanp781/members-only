"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("@models/user"));
const post_1 = __importDefault(require("@models/post"));
const express_validator_1 = require("express-validator");
const PostController = {
    get_index: (req, res, next) => {
        post_1.default.find({}).populate('user').exec((err, posts) => {
            if (err) {
                return next(err);
            }
            res.render("index", {
                title: "Index",
                posts,
            });
        });
    },
    post_clubhouse_password: (req, res, next) => {
        if (req.body.clubhousePassword == process.env.CLUBHOUSE_PW) {
            user_1.default.findByIdAndUpdate(res.locals.currentUser._id, {
                $set: { clubhouse: true },
            }, (err, newUser) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    },
    get_post_form: (req, res, next) => {
        res.render('post-form', {
            title: 'Create Post'
        });
    },
    //Not the best naming I've done
    post_post_form: [
        (0, express_validator_1.body)('title', "Title must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        (0, express_validator_1.body)('content', "Content must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            const post = new post_1.default({
                title: req.body.title,
                content: req.body.content,
                user: res.locals.currentUser._id
            });
            if (!errors.isEmpty()) {
                res.render('post_form', {
                    title: "Create Post",
                    postTitle: req.body.title,
                    postContent: req.body.content,
                });
                return;
            }
            post.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    ]
};
exports.default = PostController;
