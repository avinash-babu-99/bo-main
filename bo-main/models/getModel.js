const mongoose = require("mongoose");
const slugify = require("slugify")

const DBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  value: {
    type: Number,
  },
  alias: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  slug: String,
  secretAccount: {
    type: Boolean,
    default: false,
  }
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
}
);

// it will be only virtual in the output, won't be saved in the DB
DBSchema.virtual('virtualPropertValueConversion').get(function(){
  return this.value * 2
})


// Document middleware - runs before .save() and .create()
DBSchema.pre('save',function(next){
  // this in the console points to the processing document
// console.log(this)
this.slug = slugify(this.name, {lower: true})
next()
})

// DBSchema.post('save', function(doc, next){
//   console.log(doc)
//   next()
// })

// DBSchema.pre('find', function(next){
//   this.find({ secretAccount: {$ne: true}})
//   next()
// })

DBSchema.pre(/^find/, function(next){
  this.find({secretAccount: {$ne: true}})
  next()
})
DBSchema.post(/^find/, function(doc, next){
  // console.log(doc)
  next()
})
DBSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match: {
    secretAccount: {
      $ne: true
    }
  }})
  // console.log(this.pipeline())
  next()
})

const DBModel = mongoose.model("prac2", DBSchema);

module.exports = DBModel;
