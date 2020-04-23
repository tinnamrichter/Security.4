"use strict";
import { $ } from "./modules/nQuery.js";
import { Ajax } from "./modules/Ajax.js";

//var url = window.location.href.substring(22);

const newTodos = function (ev) { //continents
    let req = Object.create(Ajax);
    req.init();
    req.getFile("/users/user", makeToDos);
};
const getTodos = function (ev) { //continents
    let req = Object.create(Ajax);
    req.init();
    req.getFile("/users/user/todo", showToDos);
};
 
//Make to do
const makeToDos = function (e) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate()
    let date = year +"-"+month+"-"+day
    
    var dateControl = document.querySelector('input[type="date"]');
    dateControl.setAttribute("value", date);
    dateControl.setAttribute("min", date);
}
//Show to do
const showToDos = function (e) {
    console.log(e.target.getResponseHeader("Content-Type"));
    let element = $("toDo");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let to = JSON.parse(e.target.responseText);
    console.log(to)

    to.forEach(function (todo) {
        let arr = ["#FFFA94", "#FFAAFB", "#AAFFAD", "#AABFFF"]; //Gul, pink, grøn, blå
        var randomValue = arr[Math.floor(arr.length * Math.random())];

        let tabel = document.createElement("table");
        tabel.setAttribute("style", "background-color:"+randomValue);
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        let lnk = document.createElement('a');                        // denne blok i stedet for
        lnk.setAttribute("href", "user/delete/"+todo.created);
        let delI = document.createTextNode("X");
        lnk.setAttribute("class", "delete");
        lnk.appendChild(delI);
        td.appendChild(lnk);
        tr.appendChild(td);

        let tr1 = document.createElement('tr');
        let p = document.createElement("p");
        p.setAttribute("class", "smallHeading");
        let tit = document.createTextNode("Title:");
        let TOp = document.createElement("p");
        let TODOtit = document.createTextNode(todo.title);
        p.appendChild(tit);
        TOp.appendChild(TODOtit);
        tr1.appendChild(p);
        tr1.appendChild(TOp);

        let p2 = document.createElement("p");
        p2.setAttribute("class", "smallHeading");
        let start = document.createTextNode("Start:");
        let TOp2 = document.createElement("p");
        let TODOstart = document.createTextNode(todo.start);
        p2.appendChild(start);
        TOp2.appendChild(TODOstart);
        tr1.appendChild(p2);
        tr1.appendChild(TOp2);

        let p3 = document.createElement("p");
        p3.setAttribute("class", "smallHeading");
        let dead = document.createTextNode("Deadline:");
        let TOp3 = document.createElement("p");
        let TODOdead = document.createTextNode(todo.deadline);
        p3.appendChild(dead);
        TOp3.appendChild(TODOdead);
        tr1.appendChild(p3);
        tr1.appendChild(TOp3);

        let p1 = document.createElement("p");
        p1.setAttribute("class", "smallHeading");
        let text = document.createTextNode("Message:");
        let TOp4 = document.createElement("p");
        let TODOtext = document.createTextNode(todo.text);
        p1.appendChild(text);
        TOp4.appendChild(TODOtext);
        tr1.appendChild(p1);
        tr1.appendChild(TOp4);

        tabel.appendChild(tr);
        tabel.appendChild(tr1);

        $("toDo").appendChild(tabel);
        
    });


/*
    let JSONform = document.createElement('form');
        JSONform.setAttribute("method", "POST");
        JSONform.setAttribute("action", "/users/download");

        let JSONinput = document.createElement('input');
        JSONinput.setAttribute("name", "title");
        JSONinput.setAttribute("type", "hidden");
        JSONform.appendChild(JSONinput);

        let JSONdelButton = document.createElement('button');
        let JSONdelI = document.createTextNode("Download todo JSON");
        JSONdelButton.setAttribute("type", "submit");
        JSONdelButton.appendChild(JSONdelI);
        JSONform.appendChild(JSONdelButton);

        $("toDo").appendChild(JSONform);
*/
}

function work(){
    newTodos();
    getTodos();
}


window.addEventListener("load", work);
 
