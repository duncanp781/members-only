import express, { NextFunction, Request, Response } from 'express';
import Controller from 'src/controllers/controller';
const router = express.Router();

//Routes
router.get('/', Controller.get_index);

router.get('/sign-up', Controller.get_signup);

router.post('/sign-up', Controller.post_signup);



export {router as indexRouter};
