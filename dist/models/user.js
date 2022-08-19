"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 25, unique: true },
    password: { type: String, required: true },
    clubhouse: { type: Boolean, required: true },
    admin: { type: Boolean },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
