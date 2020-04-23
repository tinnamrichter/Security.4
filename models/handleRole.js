"use strict";
const mon = require("./mongooseWrap");
const Role = require("./Role");
const dbServer = "localhost";
const dbName = "user";


exports.getRole = async function (query, sort) {
    try {
        let cs = await mon.retrieve(dbServer, dbName, Role, query, sort);
        return cs;
    } catch (e) {
        console.error(e);
    }
};
