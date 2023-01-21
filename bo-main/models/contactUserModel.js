const  Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const schema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter the name!!'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'please enter the phone number'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'please enter the password'],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm the password'],
    validate: {
      validator: function(el){
        return el === this.password
      },
      message: 'passwords are not the same'
    },
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

})

schema.pre("save", async function (next) {
  // this runs when the password modifies
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

schema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const model = Mongoose.model('contactUser', schema)
module.exports = model
