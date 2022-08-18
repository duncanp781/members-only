import User from "@models/user";
import Post from "@models/post";
import express, { NextFunction, Request, Response } from "express";
import {body, validationResult} from 'express-validator';

const PostController: any = {
  get_index: (req: Request, res: Response, next: NextFunction) => {
    Post.find({}).populate('user').exec((err, posts) => {
      if (err){
        return next(err);
      }
      res.render("index", {
        title: "Index",
        posts,
      });
    })
  },

  post_clubhouse_password: (req: Request, res: Response, next: NextFunction) => {
    if(req.body.clubhousePassword == process.env.CLUBHOUSE_PW){
      User.findByIdAndUpdate(res.locals.currentUser._id, {
        $set: {clubhouse: true},
      }, (err, newUser) => {
        if(err){
          return next(err);
        }
        res.redirect('/');
      })
    }
    
  },

  get_post_form: (req: Request, res: Response, next: NextFunction) => {
    res.render('post-form', {
      title: 'Create Post'
    })
  },

  //Not the best naming I've done
  post_post_form: [
    body('title', "Title must not be empty.")
      .trim()
      .isLength({min: 1})
      .escape(),
    body('content', "Content must not be empty.")
      .trim()
      .isLength({min: 1})
      .escape(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: res.locals.currentUser._id
      })
      if(!errors.isEmpty()){
        res.render('post_form', {
          title: "Create Post",
          postTitle: req.body.title,
          postContent: req.body.content,
        })
        return;
      }
      post.save((err) => {
        if(err){
          return next(err);
        }
        res.redirect('/');
      })
    }
  ]


}

export default PostController