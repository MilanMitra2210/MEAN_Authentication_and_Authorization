import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
      default: "https://w7.pngwing.com/pngs/665/162/png-transparent-user-avatar-system-watchsport-windows-7-professional-x64-serial-number-others.png"
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    roles:{
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Role"
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female', 'Others'],
    },
    hobbies: [{
        type: String,
        required: false,
        enum: ['Reading', 'Travelling', 'Coding'],
    }],
    isMailVerified:{
      type: Boolean,
      default: false,
    },
    isPhoneVerified:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
