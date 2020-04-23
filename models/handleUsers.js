"use strict";
const mon = require("./mongooseWrap");
const bcrypt = require('bcryptjs');                         // added for hashing
const User = require("./User");
const saltTurns = 10;
const dbServer = "localhost";
const dbName = "user";

exports.upsertUser = async function (req) {
    let check = { email: req.body.email };
    let user = new User({
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltTurns)
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
    } catch(e) {
        console.error(e);
    }
};

exports.verifyUser = async function (req) {
    let check = { email: req.body.email };
    let u = await this.getUsers(check);
    let success = await bcrypt.compare(req.body.password, u[0].password);
    if (success) {
        req.session.authenticated = true;
        req.session.role = u[0].role;
        req.session.email = u[0].email;
        req.session.user = u[0].firstName;
    } else {
        req.session = undefined;
    }
    return success;
};

exports.getUsers = async function (query, sort) {
    try {
        let cs = await mon.retrieve(dbServer, dbName, User, query, sort);
        return cs;
    } catch (e) {
        console.error(e);
    }
};

exports.delUsers = async function (name) {
    try {
        let cs = await mon.remove(dbServer, dbName, User, name);
        return cs;
    } catch (e) {
        console.log(e);
    }
}

exports.changeUser = async function (req) {
    let check = { email: req.body.email };
    let user = new User({
        role: req.body.roles,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
    } catch(e) {
        console.error(e);
    }
};

// If user is not present stop
exports.checkUser = function (req) {
    var user = req.session.user;
    if (user == null) {
      alert('Error');
    } else {
      return user;
    }
};