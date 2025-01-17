let proto = {};

function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val;
  });
}

function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name];
  });
}

let requestSet = [];
let requestGet = ["query"];

let responseSet = ["body", "status"];
let responseGet = responseSet;

requestSet.forEach(ele => {
  delegateSet("request", ele);
});

requestGet.forEach(ele => {
  delegateGet("request", ele);
});

responseSet.forEach(ele => {
  delegateSet("response", ele);
});

responseGet.forEach(ele => {
  delegateGet("response", ele);
});

module.exports = proto;
