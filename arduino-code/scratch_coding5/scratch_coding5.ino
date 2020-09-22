#include <Wire.h>             // Library for I2C communication between master and slave

const int RH_D1 = 4;
const int RH_D2 = 34;
const int RH_D3 = 35;
const int LH_D1 = 5;
const int LH_D2 = 36;
const int LH_D3 = 37;
const int LED_FRT = 7;
const int BR = 6;
const int IR1 = A4;           // IR front
const int IR2 = A5;           // IR left
const int IR3 = A6;           // IR right
const int RH_ENA = 2;         // Right hand encoder A
const int RH_ENB = A8;        // Right hand encoder B
const int LH_ENA = 3;         // Left hand encoder A
const int LH_ENB = A9;        // Left hand encoder B
const int LSR_out1 = 19;      // Lidar STOP zone
const int LSR_out2 = A10;     // Lidar SLOW zone
const int LSR_out3 = A11;     // Lidar FREE zone

#define RH_ENA 2
#define RH_ENB A8
#define LH_ENA 3
#define LH_ENB A9

int cmd = 0;
int heartbeat = 0;
int joystick;
int count = 0;
int Analog_IR1;               // to store IR front value
int Analog_IR2;               // to store IR left value
int Analog_IR3;               // to store IR right value
int Value_IR;                 // to override unmovable obstacle
int Comp_IR;                // to override unmovable obstacle
int lid_2;                    // to store lidar 2 value
int lid_3;                    // to store lidar 3 value

int table[] = {0,0};

volatile unsigned int encoder_RH = 0;     // to store encoder right hand value
volatile unsigned int encoder_LH = 0;     // to store encoder left hand value
volatile unsigned int lid_1 = 0;          // to store lidar 1 value

unsigned long int startMillis;            // to provide delay when pressing pendant REVERSE
unsigned long int currentMillis;

void setup() {
  
  pinMode(RH_ENA, INPUT);                 // pin mode
  pinMode(RH_ENB, INPUT);
  pinMode(LH_ENA, INPUT);
  pinMode(LH_ENB, INPUT);
  pinMode(LSR_out1, INPUT);
  pinMode(LSR_out2, INPUT);
  pinMode(LSR_out3, INPUT);

  digitalWrite(RH_ENA, HIGH);             // pull up
  digitalWrite(RH_ENB, HIGH);
  digitalWrite(LH_ENA, HIGH);
  digitalWrite(LH_ENB, HIGH);
  digitalWrite(LSR_out1, HIGH);
  digitalWrite(LSR_out2, HIGH);
  digitalWrite(LSR_out3, HIGH);
  
  pinMode(BR,OUTPUT);
  pinMode(RH_D1,OUTPUT);
  pinMode(RH_D2,OUTPUT);
  pinMode(RH_D3,OUTPUT);
  pinMode(LH_D1,OUTPUT);
  pinMode(LH_D2,OUTPUT);
  pinMode(LH_D3,OUTPUT);
  pinMode(LED_FRT, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(2), EncoderA_RH, CHANGE);   // attach interrupt
  attachInterrupt(digitalPinToInterrupt(3), EncoderA_LH, CHANGE);
  attachInterrupt(digitalPinToInterrupt(19), Lidar_out1, CHANGE);

  Wire.begin();

  analogWrite(RH_D1,30);
  analogWrite(LH_D1,30);
  Serial.begin(9600);
  digitalWrite(RH_D2,HIGH);
  digitalWrite(LH_D2,HIGH);

}

void loop() {
  
  if(Serial.available()>0) {
    joystick = Serial.parseInt();
    
      heartbeat = 0;
    
    if (cmd != joystick && joystick != 0) {
      cmd = joystick; 
      } 
   }
  
  heartbeat++;
    
  if (heartbeat == 500) {
    cmd = 8;
    heartbeat = 0;
  }

  Analog_IR1 = analogRead(IR1);
  Analog_IR2 = analogRead(IR2);
  Analog_IR3 = analogRead(IR3);

//  lid_2 = digitalRead(LSR_out2);
  lid_3 = digitalRead(LSR_out3);

  Wire.requestFrom(8,3);

  for(int i=0; i<3; i++){
    byte cm = Wire.read();
    table[i] = int(cm);
  }

//  Serial.print(table[0]);
//  Serial.print("\t");
//  Serial.print(table[1]);
//  Serial.print("\t");
//  Serial.print(table[2]);
//  Serial.print("\n");

  if (Analog_IR1 > 200 && Analog_IR1 < 300 && Analog_IR2 > 250 && Analog_IR2 < 350 && Analog_IR3>200 && Analog_IR3<300 && lid_1 == 0) {   //permisible
    Value_IR = 1;
    Comp_IR = 1;
  }
  
  else if (Analog_IR1 < 200 || Analog_IR1 > 300 || Analog_IR2 < 250 || Analog_IR2 > 350 || Analog_IR3 < 200 || Analog_IR3 > 300 || lid_1 == 1) {  //not permisible
    Value_IR = 2;
    
    if (Comp_IR != Value_IR) {
      move_motor(8);
      
      if (cmd == 9) {
        Value_IR = 1;
        Comp_IR = 2;
      }
    }

    else if (Comp_IR == Value_IR) {
      Value_IR = 1;
    }
  }
  

  if (lid_2 == 1 || Comp_IR == 2) {
    if (cmd == 2){
      cmd = 1;
    }
  }

  if(Value_IR == 1) {
      move_motor(cmd);
  }
}

void move_motor(int cmd) {                
  
  if(cmd == 1) {                          // Forward slow
    analogWrite(RH_D1,150);
    analogWrite(LH_D1,150);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,HIGH);
    digitalWrite(LH_D3,HIGH);
    analogWrite(LED_FRT,50);
  }

  else if(cmd == 2) {                     // Forward fast
    analogWrite(RH_D1,200);
    analogWrite(LH_D1,200);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,HIGH);
    digitalWrite(LH_D3,HIGH);
    analogWrite(LED_FRT,200);
  }

  else if(cmd == 3) {                     // Rotate clockwise
    analogWrite(RH_D1,70);
    analogWrite(LH_D1,70);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,LOW);
    digitalWrite(LH_D3,HIGH);
    analogWrite(LED_FRT,100);
  }

  else if(cmd == 4) {                     // Rotate counter clockwise
    analogWrite(RH_D1,70);
    analogWrite(LH_D1,70);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,HIGH);
    digitalWrite(LH_D3,LOW);
    analogWrite(LED_FRT,100);
  }

  else if(cmd == 7) {                     // Reverse
    analogWrite(RH_D1,150);
    analogWrite(LH_D1,150);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,LOW);
    digitalWrite(LH_D3,LOW);
    analogWrite(LED_FRT,100);
  }

  else if(cmd == 8) {                     // Stop
    digitalWrite(RH_D2,HIGH);
    digitalWrite(LH_D2,HIGH);
    analogWrite(RH_D1,50);
    analogWrite(LH_D1,50);
    digitalWrite(BR,HIGH);
    analogWrite(LED_FRT,50);
  }

  else {                                  // Stop if cmd value is garbage
    digitalWrite(RH_D2,HIGH);
    digitalWrite(LH_D2,HIGH);
    analogWrite(RH_D1,50);
    analogWrite(LH_D1,50);
    digitalWrite(BR,HIGH);
    analogWrite(LED_FRT,50);
  }
}

void EncoderA_RH() {
  if(digitalRead(RH_ENB) == digitalRead(RH_ENA)) {      // Increase encoder if motor moving forward
    encoder_RH = encoder_RH + 1;
  }
  else {
    encoder_RH = encoder_RH - 1;                        // Decrease encoder if motor moving backward
  }
}

void EncoderA_LH() {
  if(digitalRead(LH_ENB) == digitalRead(LH_ENA)) {      // Increase encoder if motor moving forward
    encoder_LH = encoder_LH - 1;
  }
  else {
    encoder_LH = encoder_LH + 1;                        // Decrease encoder if motor moving backward
  }
}

void Lidar_out1() {
  if(digitalRead(LSR_out1)) {                           // if object detected
    lid_1=1;
  }

  else {                                                // if object not detected
    lid_1=0;
  }
}
