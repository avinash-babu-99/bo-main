const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const DBSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is necessary"],
      unique: true,
      trim: true,
      maxlength: [40, "max of only 40 characters is required"],
      minlength: [3, "min of 3 character is required"],
      // we can add enumeration if needed
      // enum: {
      //   values: ['enum 1', 'enum 2', 'enum 3'],
      //   message: 'error can be sent here'
      // }

      // we can other methods in Validator based on the requirments
      // validate: [validator.isAlphanumeric, 'Should have only numbers and characters']
    },
    age: {
      type: Number,
      default: 1,
      min: [1, "min age should be 1"],
      max: [100, "max age should be 100"],
      // we can add custom validations if required
      // validate:{
      //   validator: function(val){
      //     return val<50
      //   },
      //   message: 'error message if needed'
      // }
    },
    locations: {
      type: Array
    },
    value: {
      type: Number,
    },
    alias: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    description: String,
    slug: String,
    imageCover: String,
    secretAccount: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// it will be only virtual in the output, won't be saved in the DB
DBSchema.virtual("virtualPropertValueConversion").get(function () {
  return this.value * 2;
});

// Document middleware - runs before .save() and .create()
DBSchema.pre("save", function (next) {
  // this in the console points to the processing document
  // console.log(this)
  this.slug = slugify(this.name, { lower: true });
  next();
});

// DBSchema.post('save', function(doc, next){
//   console.log(doc)
//   next()
// })

// DBSchema.pre('find', function(next){
//   this.find({ secretAccount: {$ne: true}})
//   next()
// })

DBSchema.pre(/^find/, function (next) {
  this.find({ secretAccount: { $ne: true } });
  next();
});
DBSchema.post(/^find/, function (doc, next) {
  // console.log(doc)
  next();
});
DBSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      secretAccount: {
        $ne: true,
      },
    },
  });
  // console.log(this.pipeline())
  next();
});

const DBModel = mongoose.model("prac2", DBSchema);

module.exports = DBModel;
