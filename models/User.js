import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "#000000"
    }
})

const User = mongoose.model('user', UserSchema);
export default User;