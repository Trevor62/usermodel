import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 'String' should be capitalized
    email: { type: String, required: true, unique: true }, // 'String' should be capitalized
    password: { type: String, required: true }, // 'String' should be capitalized
    cartData: { type: Object, default: {} }, // 'Object' should be capitalized
}, { minimize: false }); // Correct spelling of 'minimize'

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
