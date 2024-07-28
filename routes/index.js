var express = require('express');
var router = express.Router();
const userModel = require('./users');
const menuModel = require('./menu');
const CustomerOrder = require('./order');
const qrcode = require('qrcode');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const upload = require("./multer");


passport.use(new localStrategy(userModel.authenticate())); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/home', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('home',{user});
});


router.get('/order', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const orders = await CustomerOrder.find({ user: user._id }).populate("user").sort({ createdAt: -1 }); // Sort by createdAt in descending order
  res.render('order', { orders, user });
});

router.get('/account', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username:req.session.passport.user});
  res.render('account',{user});
});


router.get('/previewmenu',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({ username: req.session.passport.user });
  const menu = await menuModel.find({ user: user._id }).populate("user");
  const qrCodeUrl = await qrcode.toDataURL(`https://scansavourmenu.onrender.com/menu/${user._id}`);
  res.render('previewmenu', { menu, qrCodeUrl, user });
});


router.post('/add-menu', isLoggedIn, async function(req, res){
  const user = await userModel.findOne({ username: req.session.passport.user });
  const menuData = await menuModel.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    user: user._id,
  });

  user.menus.push(menuData._id);
  await user.save();
  res.redirect("/createmenu");
});

router.post('/delete-menu/:id', async function(req, res){
  await menuModel.findByIdAndDelete( req.params.id );
  res.redirect("/createmenu");
});

router.get('/createmenu', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const menu = await menuModel.find({ user: user._id }).populate("user");
  res.render('createmenu', { menu, user });
});


router.get('/menu/:userId', async function(req, res){
  const user = await userModel.findById( req.params.userId );
  const menuItems = await menuModel.find({ user: user }).populate("user");
  const userId = user._id;
  res.render('menu', { menuItems, userId, user });
});


router.get('/previewmenu', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('previewmenu',{user});
});


router.post('/order/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    console.log(userId);
    const { selectedItems, total } = req.body;
    const orderItems = selectedItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder = new CustomerOrder({
      user: user._id,
      items: orderItems,
      total: total
    });

    await newOrder.save();
    user.orders.push(newOrder._id);
    await user.save();

    res.status(200).send('Order processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing your order');
  }
});


router.post("/update", upload.single('images'), async function(req, res){
  const user = await userModel.findOneAndUpdate(
    {username: req.session.passport.user}, 
    {username: req.body.username, name: req.body.name, email: req.body.email}, 
    {new: true}
  );

  if(req.file){
    user.profileImage = req.file.filename;
  }
  await user.save();
  res.redirect("/account");
});


router.post("/details", upload.single("images"), isLoggedIn, async function(req, res) {
  const user = await userModel.findOneAndUpdate(
    {username: req.session.passport.user}, 
    {shopname: req.body.shopname, type: req.body.type, location: req.body.location, contact: req.body.contact}, 
    {new: true}
  );

  if(req.file){
    user.picture = req.file.filename;
  }
  await user.save();
  res.redirect("/account");
});






router.get('/dashboard', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const menu = await menuModel.find({ user: user._id }).populate("user");
  const qrCodeUrl = await qrcode.toDataURL(`https://scansavourmenu.onrender.com/menu/${user._id}`);
  res.render('dashboard', {user, qrCodeUrl, menu});
});

router.post("/register", function(req, res) {
  const customerData = new userModel({
    username: req.body.username, 
    name: req.body.name,
    email: req.body.email,
  });

  userModel.register(customerData, req.body.password)
  .then(function() {
    passport.authenticate("local")(req, res, function(){
      res.redirect("/home");
    })
  })
  .catch(function(err) {
    console.error("Registration error:", err);
    res.status(400).send("Registration failed: " + err.message);
  });
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
}), function(req, res) {
});





router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if(err){return next(err);}
    res.redirect("/");
  });
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}


module.exports = router;
