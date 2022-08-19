"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.default.Router();
exports.indexRouter = router;
//Routes
router.get('/', postController_1.default.get_index);
router.get('/sign-up', authController_1.default.get_signup);
router.post('/sign-up', authController_1.default.post_signup);
router.get('/sign-in', authController_1.default.get_signin);
router.post('/sign-in', authController_1.default.post_signin);
router.get('/sign-out', authController_1.default.get_signout);
router.get('/post-form', postController_1.default.get_post_form);
router.post('/post-form', postController_1.default.post_post_form);
router.post('/clubhouse-password', postController_1.default.post_clubhouse_password);
router.post('/post/:id', postController_1.default.delete_post);
