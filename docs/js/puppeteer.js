var acc = [90, 90];

function yawVolume(vol) {
  document.querySelector('#yaw_volume').value = vol;
  acc[0] = parseInt(vol);
  if (connectedData !== null) connectedData.send(acc);;
}

function pitchVolume(vol) {
  document.querySelector('#pitch_volume').value = vol;
  acc[1] = parseInt(vol);
  if (connectedData !== null) connectedData.send(acc);;
}
