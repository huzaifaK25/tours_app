import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
    select: false,
    required: [true, 'Please enter a password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on .create()/.save()
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // runs if password is modified
  if (!this.isModified('password')) return next();
  // creates hash of password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePw, userPw) {
  return await bcrypt.compare(candidatePw, userPw);
};

userSchema.methods.changedPassword = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimestamp < changeTimestamp;
  }
  // False means PW was not changed after creation
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
