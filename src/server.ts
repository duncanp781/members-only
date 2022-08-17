import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import 'dotenv/config'
console.log(process.env);

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

// Constants
const app = express();


/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}


/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set views
app.set('view engine', 'pug');
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Serve index.html file
app.get('/', (_: Request, res: Response) => {
    res.render('index', {
        title: "Hello World",
        message: "Is this thing on",
    })
});



// Export here and start in a diff file (for testing).
export default app;
