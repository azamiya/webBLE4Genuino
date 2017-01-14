#include <BLEAttribute.h>
#include <BLECentral.h>
#include <BLECharacteristic.h>
#include <BLECommon.h>
#include <BLEDescriptor.h>
#include <BLEPeripheral.h>
#include <BLEService.h>
#include <BLETypedCharacteristic.h>
#include <BLETypedCharacteristics.h>
#include <BLEUuid.h>
#include <CurieBLE.h>

#include <Servo.h>

BLEPeripheral blePeripheral;
BLEService lsService("341c0fab-4de8-47b2-a5c9-52c74207b5b7");
BLECharacteristic fanChar("b103174a-d4dd-4e77-9dfc-da1230970168", BLEWriteWithoutResponse, 2);

Servo servoPitch;
Servo servoYaw;

int temp;
unsigned char value;

void setup() {
  Serial.begin(115200);    // initialize serial communication
  pinMode(13, OUTPUT);   // initialize the LED on pin 13 to indicate when a central is connected

  servoPitch.attach(3);
  servoPitch.write(90);
  servoYaw.attach(5);
  servoYaw.write(90);

  blePeripheral.setLocalName("ProjectLS");
  blePeripheral.addAttribute(lsService);
  blePeripheral.addAttribute(fanChar);

  blePeripheral.begin();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  BLECentral central = blePeripheral.central();
  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    digitalWrite(13, HIGH);
    while (central.connected()) {
      if (fanChar.written()) {
        /* Pitch */
        value = fanChar.value()[0];
        Serial.println(value);
        temp = map(value, 30, 150, 60, 180);
        servoPitch.write(temp);
        /* Yaw */
        value = fanChar.value()[1];
        Serial.println(value);
        temp = map(value, 30, 150, 0, 180);
        servoYaw.write(temp);
      }
    }
    /* Default */
    servoPitch.write(90);
    servoYaw.write(90);
    digitalWrite(13, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}
