/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express, { NextFunction, Request, Response } from 'express';
import Controller from 'src/controllers/controller';
import passport from 'passport';
const router = express.Router();

//Routes
router.get('/', Controller.get_index);

router.get('/sign-up', Controller.get_signup);

router.post('/sign-up', Controller.post_signup);

router.get('/sign-in', Controller.get_signin);

router.post('/sign-in', Controller.post_signin);

router.get('/sign-out', Controller.get_signout);

export {router as indexRouter};
