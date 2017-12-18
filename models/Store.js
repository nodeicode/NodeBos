const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
name:{
  type:String,
  trim:true,
  required:'Please enter a store name!',
},
slug:String,
description:{
  type:String,
  trim:true,
},
tags:[String],
created: {
   type: Date,
   default: Date.now,
},
location:{
   type: {
      type:String,
      default:'Point',
   },
   coordinates:[{
      type: Number,
      required: 'you must supply coordianates!',
   }],
   address: {
      type: String,
      required:'You must supply an address!'
   }
},
photo: String
});

storeSchema.pre('save',function(next){
if(!this.isModified('name')){
  next() //skip it
  return;// stop this function
}
  this.slug = slug(this.name);
  next();
  // tODO to make more resilient
});

module.exports = mongoose.model('Store',storeSchema);
