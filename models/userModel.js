import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter your email'],
    validate: [validator.isEmail, 'Plese enter a valid email'],
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please enter a password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;
