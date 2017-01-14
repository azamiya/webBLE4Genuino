window.onkeydown = main;
window.onload = function() {
  var search = document.querySelector("#search");
  search.onclick = function() {
   main({key: "r"});
  };

  document.querySelector("#on").onclick = () => {
    if(chara) chara.writeValue( new Uint8Array([0x01]));
    console.log("hello");
    console.log(chara);
  };
  document.querySelector("#off").onclick = () => {
    if(chara) chara.writeValue( new Uint8Array([0x00]));
  };
}

window.DEVICE = null;
var chara = null;

function main(e) {
  if(e.key !== "r" ) {
    return ;
  }
  _init();
  try {

    navigator.bluetooth.requestDevice({
      filters: [{name: "LED"}],
      optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"]
    })
      .then( device => {
        log("device found ");
        log(device);
        console.dir(device);
        return device.gatt.connect();
      })
    .then( server => {
      log("deivice connected");
      log(server);
      console.log(server);
      window["server"] = server;
      return server.getPrimaryService("19b10000-e8f2-537e-4f6c-d104768a1214")
    })
    .then( service => {
      log("service fetched");
      log(service);
      return service.getCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214");
    })
    .then( characteristic => {
      window["chara"] = characteristic;
      log("read Characteristic");
      log(characteristic);
      log("=============");
      log(characteristic.value);
      var val = characteristic.readValue();
      log(val);
      return val;
    })
    .then( value => {
      log("Read Value");
      log(value);
      log(String(value));
      return window["chara"].writeValue( new Uint8Array(0x01));
    })
    .then( res => {
      log("wrote value");
      log(res);
    })
    .catch( e => {
      err(e);
    });
  } catch(e) {
    err(e);
  }
}


function anyDevice() {
  return Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    .map(c => ({namePrefix: c}))
    .concat({name: ''});
}

/***************************/
var _logger;
function _init() {
  _logger = document.querySelector("#logger"); 
  console.log(_logger);
  log("start logging...");
}

function log(msg, color) {
  console.log(msg, typeof msg);
  var tt = document.createElement("TT");
  if ( typeof msg === "object") {
    for(let key in msg) {
      log("--" + key + " : " + typeof msg[key] + " => " + msg[key] , "black" );
    }
  } else {
    tt.textContent = msg;
    tt.style.color = color || "blue";
    var cr = document.createElement("BR");
    _logger.appendChild(tt);
    _logger.appendChild(cr);
  }
}

function err(msg) {
  var tt = document.createElement("TT");
  tt.textContent = msg;
  tt.style.color = "red";
  var cr = document.createElement("BR");
  _logger.appendChild(tt);
  _logger.appendChild(cr);

}
