#include <Wire.h>             // Library for I2C communication between master and slave

// Pin declaration

const int RH_D1 = 4;          // Right hand PWM
const int RH_D2 = 34;         // Right hand STOP
const int RH_D3 = 35;         // Right hand DIRECTION
const int RH_A1 = A0;         
const int RH_A2 = A1;
const int RH_ENA = 2;         // Right hand encoder A
const int RH_ENB = A8;        // Right hand encoder B
const int LH_D1 = 5;          // Left hand PWM
const int LH_D2 = 36;         // Left hand STOP
const int LH_D3 = 37;         // Left hand DIRECTION
const int LH_A1 = A2;
const int LH_A2 = A3;
const int LH_ENA = 3;         // Left hand encoder A
const int LH_ENB = A9;        // Left hand encoder B
const int BR = 6;
const int LED_FRT = 7;        // LED strip
const int IR1 = A4;           // IR front
const int IR2 = A5;           // IR left
const int IR3 = A6;           // IR right
const int ES = 18;            // Emergency stop
const int LSR_out1 = 19;      // Lidar STOP zone
const int LSR_out2 = A10;     // Lidar SLOW zone
const int LSR_out3 = A11;     // Lidar FREE zone
const int Pen_fwd = 26;       // Pendant FORWARD
const int Pen_rev = 32;       // Pendant REVERSE
const int Pen_right = 30;     // Pendant RIGHT
const int Pen_left = 22;      // Pendant LEFT
const int Pen_start = 24;     // Pendant START
const int Pen_stop = 28;      // Pendant STOP
const int SW_REM = 33;        // Selector REMOTE
const int SW_RES = 31;        // Selector RESCUE

#define RH_ENA 2
#define RH_ENB A8
#define LH_ENA 3
#define LH_ENB A9

// Variable declaration

int cmd = 0;                  // Command to move motor
int heartbeat = 0;            // to manage internet disconnectivity
int joystick;                 // to store value from Node server
int lid_2;                    // to store lidar 2 value
int lid_3;                    // to store lidar 3 value
int Analog_IR1;               // to store IR front value
int Analog_IR2;               // to store IR left value
int Analog_IR3;               // to store IR right value
int mode_rescue;              // to store selector RESCUE value
int mode_remote;              // to store selector REMOTE value
int Value_IR;                 // to override unmovable obstacle
int Value_CPR;                // to override unmovable obstacle

volatile unsigned int encoder_RH = 0;     // to store encoder right hand value
volatile unsigned int encoder_LH = 0;     // to store encoder left hand value 
volatile unsigned int lid_1 = 0;          // to store lidar 1 value

unsigned long int startMillis;            // to provide delay when pressing pendant REVERSE
unsigned long int currentMillis;          // to provide delay when pressing pendant REVERSE

void setup() {
  
  pinMode(RH_ENA, INPUT);                 // pin mode
  pinMode(RH_ENB, INPUT);
  pinMode(LH_ENA, INPUT);
  pinMode(LH_ENB, INPUT);
  pinMode(ES, INPUT);
  pinMode(LSR_out1, INPUT);
  pinMode(LSR_out2, INPUT);
  pinMode(LSR_out3, INPUT);
  pinMode(Pen_fwd, INPUT);
  pinMode(Pen_rev, INPUT);
  pinMode(Pen_left, INPUT);
  pinMode(Pen_right, INPUT);
  pinMode(Pen_start, INPUT);
  pinMode(Pen_stop, INPUT);
  pinMode(SW_REM, INPUT);
  pinMode(SW_RES, INPUT);

  pinMode(BR,OUTPUT);
  pinMode(RH_D1,OUTPUT);
  pinMode(RH_D2,OUTPUT);
  pinMode(RH_D3,OUTPUT);
  pinMode(LH_D1,OUTPUT);
  pinMode(LH_D2,OUTPUT);
  pinMode(LH_D3,OUTPUT);
  pinMode(LED_FRT, OUTPUT);

  
  digitalWrite(RH_ENA, HIGH);             // pull up
  digitalWrite(RH_ENB, HIGH);
  digitalWrite(LH_ENA, HIGH);
  digitalWrite(LH_ENB, HIGH);
  digitalWrite(LSR_out1, HIGH);
  digitalWrite(LSR_out2, HIGH);
  digitalWrite(LSR_out3, HIGH);
  digitalWrite(Pen_fwd, HIGH);
  digitalWrite(Pen_rev, HIGH);
  digitalWrite(Pen_left, HIGH);
  digitalWrite(Pen_right, HIGH);
  digitalWrite(Pen_start, HIGH);
  digitalWrite(Pen_stop, HIGH);
  digitalWrite(SW_REM, HIGH);
  digitalWrite(SW_RES, HIGH);
  
  attachInterrupt(digitalPinToInterrupt(2), EncoderA_RH, CHANGE);   // attach interrupt
  attachInterrupt(digitalPinToInterrupt(3), EncoderA_LH, CHANGE);
  attachInterrupt(digitalPinToInterrupt(19), Lidar_out1, CHANGE);

  analogWrite(RH_D1,30);                  // Initialize PWM to 30
  analogWrite(LH_D1,30);
  
  Serial.begin(9600);
  
  digitalWrite(RH_D2,HIGH);               // Initialize motor to STOP
  digitalWrite(LH_D2,HIGH);
}

void loop() {


  mode_rescue = digitalRead(SW_RES);
  mode_remote = digitalRead(SW_REM);

  while(mode_remote==0) {        //read value from joystick
    
    if(Serial.available()>0) {
      joystick = Serial.parseInt();
      Serial.print(joystick);
      Serial.print("\t");
    
      heartbeat = 0;
    
    if (cmd != joystick && joystick != 0) {
      cmd = joystick; 
      } 
    }
  
    heartbeat++;
    
    if (heartbeat > 300) {
      cmd = 8;
      heartbeat = 0;
    }
    
    Serial.print(cmd);
    Serial.print("\t");
    Serial.print(heartbeat); 
    Serial.print("\n");
    
    lid_2 = digitalRead(LSR_out2);
    lid_3 = digitalRead(LSR_out3);
    
    Analog_IR1 = analogRead(IR1);
    Analog_IR2 = analogRead(IR2);
    Analog_IR3 = analogRead(IR3);

    if (Analog_IR1 > 200 && Analog_IR1 < 300 && Analog_IR2 > 200 && Analog_IR2 < 300 && Analog_IR3>200 && Analog_IR3<300) {   //permisible
      Value_IR = 1;
      Value_CPR = 1;
    }
    
    else if (Analog_IR1 < 200 || Analog_IR1 > 300 || Analog_IR2 < 200 || Analog_IR2 > 300 || Analog_IR3 < 200 || Analog_IR3 > 300) {  //not permisible
      Value_IR = 2;
    
      if (Value_CPR != Value_IR) {
        move_motor(8);
//      Serial.println("Uneven floor detected!");

        if (cmd == 9) {
          Value_IR = 1;
          Value_CPR = 2;
//        Serial.println("IR Reset");
        }
      }

      else if (Value_CPR == Value_IR) {
        Value_IR = 1;
      }
    }

    if(Value_IR == 1) {
    
      if(lid_2 == 0 && lid_1 == 0 && Value_CPR == 1) {
        move_motor(cmd);
      }
  
      else if (lid_2 == 1 && lid_1 == 0 && Value_CPR == 1) { 
        if (cmd == 2){
          cmd = 1;
        }
  
        move_motor(cmd);
        
      }
  
      else if (lid_2 == 1 && lid_1 == 0 && Value_CPR == 2) {
        if (cmd == 2){
          cmd = 1;
        }
  
        move_motor(cmd);
      }
  
      else if (lid_1 == 1 && lid_2 == 1) {
        move_motor(8);
  
  //      Serial.println("Warning obstacle in front!");
  
        if (cmd == 9) {
          lid_1 = 0;
  //        Serial.println("lid_1 reset");
        }
      }

    }
    
    mode_remote = digitalRead(SW_REM);
  }
  
  while(mode_rescue == 0) {             //read value from pendant
//    Serial.println("masuk");
    int p_start = digitalRead(Pen_start);
    int p_stop = digitalRead(Pen_stop);
    int p_fwd = digitalRead(Pen_fwd);
    int p_rev = digitalRead(Pen_rev);
    int p_left = digitalRead(Pen_left);
    int p_right = digitalRead(Pen_right);
    int p_connect;
//    Serial.println("try while masuk ke tak");
//    Serial.println(p_start);
//    Serial.println(p_stop);
//    Serial.println(p_fwd);
//    delay(2000);

    if(p_start == 0) {
      p_connect = 1;
//      Serial.println("sudah connect");
    }
    else if (p_stop ==0) {
      p_connect = 0;
      cmd= 8;
//      Serial.println("sudah disconnect");
    }
    
    if(p_connect) {
      if(p_fwd == 0 && p_rev == 1 && p_right == 1 && p_left == 1) {           //slow forward
        cmd = 2;
        move_motor(cmd);
      }
      
      else if(p_fwd == 1 && p_rev == 1 && p_right == 0 && p_left == 1) {
        cmd = 3;             //rotate clockwise
        move_motor(cmd);
      }

      else if(p_fwd == 1 && p_rev == 1 && p_right == 1 && p_left == 0) {
        cmd = 4;             //rotate counter clockwise
        move_motor(cmd);
      }

      else if(p_fwd == 1 && p_rev == 0 && p_right == 1 && p_left == 1) {
        cmd = 7;
        move_motor(cmd);
      }

      else {
        cmd = 8;
//        Serial.println("hijk");
        move_motor(cmd);
      }
    }
    
    mode_rescue = digitalRead(SW_RES);
//    Serial.println(cmd);
  }
 


  if(mode_rescue==1 && mode_remote==1) {                        //if no mode selected -> stop
    cmd = 8;
    move_motor(cmd);
  }
}

// Function declaration

void move_motor(int cmd) {                
  
  if(cmd == 1) {                          // Forward slow
    analogWrite(RH_D1,150);
    analogWrite(LH_D1,150);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,HIGH);
    digitalWrite(LH_D3,HIGH);
    analogWrite(LED_FRT,100);
  }

  else if(cmd == 2) {                     // Forward fast
//    Serial.println("hi");
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
    analogWrite(RH_D1,100);
    analogWrite(LH_D1,100);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D3,LOW);
    digitalWrite(LH_D3,LOW);
    analogWrite(LED_FRT,50);
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
