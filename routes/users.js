var express = require('express');
var router = express.Router();
const userHandler = require("../models/handleUsers");
const ToDoHandler = require("../models/handleToDo");
const roleHandler = require("../models/handleRole");
const xmlHandler = require("../models/xml");
const { body,validationResult,sanitizeBody,check } = require('express-validator');
const fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* register. */
router.get('/register', async function(req, res, next) {    // display register route
  res.render('register', {                    // display register form view
      subtitle: 'Register User'     // input data to view
  });
});
router.post('/register',  [
  check('email').isLength({ min: 1 }),
  check('password').isLength({ min: 6}),
  check('password2').isLength({ min: 6}),
  ], function(req, res) {   // new user post route

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log("not there");
    return res.render('register', {                       // display register form view
      subtitle: 'Register User',     // input data to view
      wrong: 'email or password is to short'        // input data to view
    });
  }
  userHandler.upsertUser(req);
  console.log(req.body)
  return res.redirect('/'); // skip the receipt, return to fp
});

/* Login. */
router.get('/login', function(req, res) { //start login
  res.render('login', {
      subtitle: 'User Login'
  });
});
router.post('/login', [
  check('email').isLength({ min: 5 }),
  check('password').isLength({ min: 6}),
  ], async function(req, res, next) {// new user post route
  
  //Write something - navnet eller adgangskoden er for kort
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('login', {
      subtitle:  'User Login',
      wrong: 'email or password is to short'
    });
  }

  let rc = await userHandler.verifyUser(req); // brugeren er godkendt
  console.log(rc);
  console
  if (rc) {
    if (req.session.role === 'admin') { //admin is there
      return res.redirect('/users/admin');
    } else if (req.session.role === 'user') {//user is there
        return res.redirect('/users/user');
    } else if (req.session.role === 'new') {//new user is there
      res.render('index', { 
        subtitle: "You must be authorized by a admin",
        loggedin: false,
      });
    } if (req.session.role === 'undefined') { //admin is there
      return res.redirect('/users/login');
    }
  } else { //user not there
      res.render('login', {
        subtitle: 'User Login',
          loggedin: false,
          wrong:  'email or password is incorrect' 
      });
  }
});

/* admin */
router.get('/admin',  async function(req, res) { //start login
  res.render('admin', { //admin is there
    subtitle: "The admin site",
    scriptLink:'/javascripts/admin.js',
    loggedin: true,
    who: "Hello " + req.session.user
  });
});
router.get('/admin/user',  async function(req, res) { //start login
  let user = await userHandler.getUsers({}, {sort: {role: 1, created: 1 }});
  res.json(user);
});
router.post('/adminData', async function(req, res, next) { //update the user
  let users = await userHandler.getUsers({email: req.body.email}, {sort: {}});
  let roles = await roleHandler.getRole({}, {sort: {name: 1}});
  console.log(users);
  console.log(roles);
  res.render('adminData', {
      title: "You are about to edit " + req.body.email,
      loggedin: true,
      user: users,
      role: roles,
  });
});
router.post('/admin', async function(req, res) { //start login
  console.log(req.body);
  let postUser = await userHandler.changeUser(req);
  return res.redirect('admin'); // skip the receipt, return to fp
});
router.get('/admin/delete/:email',  async function(req, res) { //slet user i admin
  console.log(req.params.email);
  let todo = await userHandler.delUsers({email: req.params.email}, {sort: {}});
  //console.log(todo);
  res.redirect('/users/admin');
});

/* user */
router.get('/user',  async function(req, res) { //start user
  //console.log(req.session.email);
  //console.log(req.session.user);
  res.render('user', { 
    subtitle: "The user site",
    scriptLink:'/javascripts/user.js',
    loggedin: true,
    who: "Hello " + req.session.user,
    read: req.session.email,
  });
});
router.post('/user/',[ //indsætter en todo liste
  check('title').isLength({ min: 1 }),
  ],  async function(req, res) { 
  const errors = validationResult(req) //Write something - title er forkort
  if (!errors.isEmpty()) {
    return res.render('user', {
      subtitle: "The user site",
      loggedin: true,
      wrong: 'Title is to short'
    });
  }
  
  let todo = ToDoHandler.upsertToDo(req);
  console.log(todo);
});
router.get('/user/todo',  async function(req, res) { //show todo
  let email = req.session.email;
  let todo = await ToDoHandler.getToDo({userID: email}, {sort: {created: -1}});
  res.json(todo);
});
router.post('/user/:email',  async function(req, res) { //makes a todo
  let todo = await ToDoHandler.upsertToDo(req);
  console.log(todo);
  return res.redirect('/users/user');
});
router.post('/user/delete/:id', async function(req, res) { //fjerner en todo  - virker ikke
  console.log(req);
  let todo = ToDoHandler.delToDo({created: req.body.id}, {sort: {}});
  console.log(todo);
  return res.redirect('/users/user');
});

/* Download a template */
router.post('/download/:type',  async function(req, res) { //download mongo
  //console.log(req.body.email);
  let url = req.url.substring(10);
  console.log(url);
  let todo = await ToDoHandler.getToDo({userID: req.body.email}, {sort: {title: 1}});
  console.log(todo);
    if(url =="json"){ //JSON template
      fs.writeFile('todoList.json', todo, (err) => {
        if (err) throw err;
        console.log('To do saved!');
        return res.redirect('/users/user');
      });
    } else if(url == "xml"){ //XML template
      let xml = await xmlHandler.xmlMaker(todo);
      //console.log(xml);
      fs.writeFile('todoList.xml', xml, (err) => {
        if (err) throw err;
        console.log('To do saved!');
        return res.redirect('/users/user');
    });
    } 
});
router.get('/user/delete/:id', async function(req, res) { //fjerner en todo  - virker ikke
  console.log("del0 " + req.params.id);
  let d = new Date(req.params.id);
  console.log("del1 " + d);
  let todo = await ToDoHandler.delToDo({created: d}, {sort: {}});
  console.log("del2 " + todo);
  res.redirect('/users/user');
});


module.exports = router;
