window.onkeydown = main;
window.onload = function() {
  displayMyCamera();
  getMyID();
  peer.login();
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
      filters: [{name: "ProjectLS"}],
      optionalServices: ["341c0fab-4de8-47b2-a5c9-52c74207b5b7"]
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
      return server.getPrimaryService("341c0fab-4de8-47b2-a5c9-52c74207b5b7")
    })
    .then( service => {
      log("service fetched");
      log(service);
      return service.getCharacteristic("b103174a-d4dd-4e77-9dfc-da1230970168");
    })
    .then( characteristic => {
      window["chara"] = characteristic;
      log("read Characteristic");
      log(characteristic);
      log("=============");
      //log(characteristic.value);
      var val = characteristic.readValue();
      //log(val);
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

var acc = [90, 90];

function yawVolume(vol) {
  document.querySelector('#yaw_volume').value = vol;
  acc[0] = parseInt(vol);
  if(chara) chara.writeValue( new Uint8Array(acc) );
}

function pitchVolume(vol) {
  document.querySelector('#pitch_volume').value = vol;
  acc[1] = parseInt(vol);
  if(chara) chara.writeValue( new Uint8Array(acc) );
}