#include <Wire.h>

const int RH_D1 = 4;
const int RH_D2 = 34;
const int RH_D3 = 35;
const int RH_A1 = A0;
const int RH_A2 = A1;
const int RH_ENA = 2;
const int RH_ENB = A8;
const int LH_D1 = 5;
const int LH_D2 = 36;
const int LH_D3 = 37;
const int LH_A1 = A2;
const int LH_A2 = A3;
const int LH_ENA = 3;
const int LH_ENB = A9;
const int BR = 6;
const int LED_FRT = 7;
const int IR1 = A4;
const int IR2 = A5;
const int IR3 = A6;
const int ES = 18;
const int LSR_out1 = 19;
const int LSR_out2 = A10;
const int LSR_out3 = A11;

#define RH_ENA 2
#define RH_ENB A8
#define LH_ENA 3
#define LH_ENB A9

int mode;
int cmd = 0;
int heartbeat = 0;
int joystick;
int lid_2;
int lid_3;
int count = 0;
int Analog_IR1;
int Analog_IR2;
int Analog_IR3;
int Value_IR;
int Value_CPR;

volatile unsigned int encoder_RH = 0;
volatile unsigned int encoder_LH = 0;
volatile unsigned int lid_1 = 0;

void setup() {
  pinMode(RH_ENA, INPUT);  
  pinMode(RH_ENB, INPUT);
  pinMode(LH_ENA, INPUT);
  pinMode(LH_ENB, INPUT);
  pinMode(ES, INPUT);
  pinMode(LSR_out1, INPUT);
  pinMode(LSR_out2, INPUT);
  pinMode(LSR_out3, INPUT);
  
  digitalWrite(RH_ENA, HIGH);   //pull up
  digitalWrite(RH_ENB, HIGH);
  digitalWrite(LH_ENA, HIGH);
  digitalWrite(LH_ENB, HIGH);
  digitalWrite(LSR_out1, HIGH);
  digitalWrite(LSR_out2, HIGH);
  digitalWrite(LSR_out3, HIGH);

  attachInterrupt(digitalPinToInterrupt(2), EncoderA_RH, CHANGE);
  attachInterrupt(digitalPinToInterrupt(3), EncoderA_LH, CHANGE);
  attachInterrupt(digitalPinToInterrupt(19), Lidar_out1, CHANGE);

  pinMode(BR,OUTPUT);
  pinMode(RH_D1,OUTPUT);
  pinMode(RH_D2,OUTPUT);
  pinMode(RH_D3,OUTPUT);
  pinMode(LH_D1,OUTPUT);
  pinMode(LH_D2,OUTPUT);
  pinMode(LH_D3,OUTPUT);
  pinMode(LED_FRT, OUTPUT);

  analogWrite(RH_D1,30);
  analogWrite(LH_D1,30);
  digitalWrite(BR,HIGH);

  Wire.begin();

  Serial.begin(9600);
}

void loop() {
  
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
  Serial.print("\t");

  lid_2 = digitalRead(LSR_out2);
  lid_3 = digitalRead(LSR_out3);

  Analog_IR1 = analogRead(IR1);
  Analog_IR2 = analogRead(IR2);
  Analog_IR3 = analogRead(IR3);

//  Serial.print("IR1 = "); Serial.print(Analog_IR1);  Serial.print("\t ");
//  Serial.print("IR2 = "); Serial.print(Analog_IR2);  Serial.print("\t ");
//  Serial.print("IR3 = "); Serial.print(Analog_IR3);  Serial.print("\n ");

  Serial.print("lidar_1: "); Serial.print(lid_1); Serial.print("\t");
  Serial.print("lidar_2: "); Serial.print(lid_2); Serial.print("\t");
  Serial.print("lidar_3: "); Serial.println(lid_3);
  Serial.print("\n");

  if (Analog_IR1 > 200 && Analog_IR1 < 300 && Analog_IR2 > 200 && Analog_IR2 < 300 && Analog_IR3>200 && Analog_IR3<300) {   //permisible
    Value_IR = 1;
    Value_CPR = 1;
  }

  else if (Analog_IR1 < 200 || Analog_IR1 > 300 || Analog_IR2 < 200 || Analog_IR2 > 300 || Analog_IR3 < 200 || Analog_IR3 > 300) {  //not permisible
    Value_IR = 2;
    
    if (Value_CPR != Value_IR) {
      digitalWrite(RH_D2,LOW);    //stop
      digitalWrite(LH_D2,LOW);
      analogWrite(RH_D1,50);
      analogWrite(LH_D1,50);
      analogWrite(LED_FRT,50);
      Serial.println("Uneven floor detected!");

      if (cmd == 9) {
        Value_IR = 1;
        Value_CPR = 2;
        Serial.println("IR Reset");
      }
    }

    else if (Value_CPR == Value_IR) {
      Value_IR = 1;
    }
  }

  if(Value_IR == 1) {
  
    if(lid_2 == 0 && lid_1 == 0 && Value_CPR == 1) {
      
      if(cmd == 1) {           //slow forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,100);
      }

      else if(cmd == 2) {      //fast forward
        analogWrite(RH_D1,200);
        analogWrite(LH_D1,200);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,200);
      }

      else if(cmd == 3) {        //rotate clockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,HIGH);
      }
  
      else if(cmd == 4) {        //rotate cclockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,LOW);    
      }
  
      else if(cmd == 7) {       //reverse
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,LOW);
        analogWrite(LED_FRT,50);
      }
  
      else if (cmd==8) {       //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        digitalWrite(BR,HIGH);
        analogWrite(LED_FRT,50);
      }  
      
      else {                        //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        analogWrite(LED_FRT,50);
      }
    }
    
    else if (lid_2 == 1 && lid_1 == 0 && Value_CPR == 1) {                        //lidar 2 triggered
    
      if(cmd == 1) {           //slow forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,100);
      }
    
      else if(cmd == 2) {      //fast forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,200);
      }

      else if(cmd == 3) {        //rotate clockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,HIGH);
      }
  
      else if(cmd == 4) {        //rotate cclockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,LOW);    
      }
  
      else if(cmd == 7) {       //reverse
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,LOW);
        analogWrite(LED_FRT,50);
      }
  
      else if (cmd==8) {       //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        digitalWrite(BR,HIGH);
        analogWrite(LED_FRT,50);
      }  
      
      else {                        //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        analogWrite(LED_FRT,50);
      }
    }
    else if (lid_2 == 1 && lid_1 == 0 && Value_CPR == 2) {                        //lidar 2 triggered
    
      if(cmd == 1) {           //slow forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,100);
      }
    
      else if(cmd == 2) {      //fast forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,200);
      }

      else if(cmd == 3) {        //rotate clockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,HIGH);
      }
  
      else if(cmd == 4) {        //rotate cclockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,LOW);    
      }
  
      else if(cmd == 7) {       //reverse
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,LOW);
        analogWrite(LED_FRT,50);
      }
  
      else if (cmd==8) {       //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        digitalWrite(BR,HIGH);
        analogWrite(LED_FRT,50);
      }  
      
      else {                        //stop
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        analogWrite(LED_FRT,50);
      }
    }

    else if (lid_1 == 1 && lid_2 == 1) {

      digitalWrite(RH_D2,LOW);
      digitalWrite(LH_D2,LOW);
      analogWrite(RH_D1,50);
      analogWrite(LH_D1,50);
      analogWrite(LED_FRT,50);

      Serial.println("Warning obstacle in front!");

      if (cmd == 9) {
        lid_1 = 0;
        Serial.println("lid_1 reset");
      }
    }

  }
}

void EncoderA_RH() {
  if(digitalRead(RH_ENB) == digitalRead(RH_ENA)) {
    encoder_RH = encoder_RH + 1;
  }
  else {
    encoder_RH = encoder_RH - 1;
  }
}

void EncoderA_LH() {
  if(digitalRead(LH_ENB) == digitalRead(LH_ENA)) {
    encoder_LH = encoder_LH - 1;
  }
  else {
    encoder_LH = encoder_LH + 1;
  }
}

void Lidar_out1() {
  if(digitalRead(LSR_out1)) {
    lid_1=1;
  }

  else {
    lid_1=0;
  }
}
