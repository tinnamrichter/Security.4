var builder = require('xmlbuilder');

exports.xmlMaker = async function (todo) {
  console.log(todo)
  console.log(todo.length)
  var root = builder.create('todos');
  for(var i=0; i < todo.length; i++){
    var to = root.ele('todo');
    var title = to.ele('title', todo[i].title).up();
    var created = to.ele('created', todo[i].created).up();
    var deadline = to.ele('deadline', todo[i].deadline).up();
    var start = to.ele('start', todo[i].start).up();
    var text = to.ele('text', todo[i].start).up();
    var userId = to.ele('userID', todo[i].userID).up();
  }
  var xml = root.end({ pretty: true});
  return xml;
  //console.log(xml);
};