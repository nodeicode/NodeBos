
const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
   storage:multer.memoryStorage(),
   fileFilter(req,file,next){
      const isPhoto = file.mimetype.startsWith('image/')
      if(isPhoto){
      next(null,true);
   }
   else {
      next({message:'that filetype isn\'t allowed!'},false)
   }
   }
};

exports.homePage = (req,res) => {
  res.render('../views/index');

};

exports.addstore = (req,res) => {
  res.render('editStore');
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req,res,next) => {
   if(!req.file){
      next();
      return;
   }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    //once we have written photo to file keep going!
    next();
}

exports.createStore = async(req,res) => {
 const store =  await(new Store(req.body)).save();
 req.flash('success', `Successfully created ${store.name}. care to leave a review?`)
 res.redirect(`/store/${store.slug}`);
}

exports.getStores = async(req,res) =>{
  //1:Query the database for a list of all stores
  const stores = await Store.find()

  res.render('stores',{title:'Stores', stores: stores});
}

exports.editStore = async (req,res) => {
   //1: find the store with given ID
   const store = await Store.findOne({_id:req.params.id});
   //2: confirm if they are the store owner

   //3: render out the edit form so the user can update the store
   res.render('editStore',{title:`Edit ${store.name}`,store})

}

exports.updateStore = async (req,res) => {
   //set location to be a point
   req.body.location.type = 'Point';
   //find and update the stores
   const store = await Store.findOneAndUpdate({_id: req.params.id},req.body,{
      new:true,
      runValidtors:true
   }).exec();

   req.flash('success',`Successfully updated <stong>${store.name}</stong>.<a href="/stores/${store.slug}">View Store ></a>`)
   res.redirect(`/stores/${store._id}/edit`)

}

exports.showStore = async (req,res, next) => {
const store = await Store.findOne({slug: req.params.name});
if(!Store)return next();
res.render('Show',{title:req.params._id,store});
}
