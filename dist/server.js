"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const routes_1 = require("./routes/routes");
const user_1 = __importDefault(require("@models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Constants
const app = (0, express_1.default)();
/***********************************************************************************
 *                                  DB Setup
 **********************************************************************************/
//Not sure why, but the connectionoptions doesn't have these options.
mongoose_1.default.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
const db = mongoose_1.default.connection;
// eslint-disable-next-line no-console
db.on("error", console.error.bind(console, "mongo connection error"));
/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// Common middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === "production") {
    app.use((0, helmet_1.default)());
}
/***********************************************************************************
 *                                  Passport Setup
 **********************************************************************************/
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: true,
}));
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
    user_1.default.findOne({ username: username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect Username" });
        }
        bcryptjs_1.default.compare(password, user.password, (err, res) => {
            if (err) {
                return done(err, false);
            }
            if (res) {
                // passwords match! log user in
                return done(null, user);
            }
            else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" });
            }
        });
    });
}));
// Apparently express.user type doesn't have id, so I'm not sure what the type is here.
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    user_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
//Passport middlewares
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Passport middleware to give us access to user
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/
// Set views
app.set("view engine", "pug");
const viewsDir = path_1.default.join(__dirname, "views");
app.set("views", viewsDir);
// Set static dir
const staticDir = path_1.default.join(__dirname, "public");
app.use(express_1.default.static(staticDir));
// Serve index.html file
app.use("/", routes_1.indexRouter);
// Export here and start in a diff file (for testing).
exports.default = app;
