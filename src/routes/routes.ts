/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import AuthController from 'src/controllers/authController';
import PostController from 'src/controllers/postController';
const router = express.Router();

//Routes
router.get('/', PostController.get_index);

router.get('/sign-up', AuthController.get_signup);

router.post('/sign-up', AuthController.post_signup);

router.get('/sign-in', AuthController.get_signin);

router.post('/sign-in', AuthController.post_signin);

router.get('/sign-out', AuthController.get_signout);

router.get('/post-form', PostController.get_post_form);

router.post('/post-form', PostController.post_post_form);

export {router as indexRouter};
