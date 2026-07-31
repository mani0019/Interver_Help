const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type :String ,
        unique:[true , "account already exists"],
        required : true,
    },
    password: {
    type: String,
    required: function () {
        return this.provider === "local";
    }},
provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
},googleId: {
    type: String,
    default: null,
},

avatar: {
    type: String,
    default: null,
},
    
})
const userModel = mongoose.model("users",userSchema);
module.exports = userModel;