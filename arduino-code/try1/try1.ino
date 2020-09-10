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

#define RH_ENA 2
#define RH_ENB A8
#define LH_ENA 3
#define LH_ENB A9

int count = 0;
int joystick;

volatile unsigned int encoder_RH = 0;
volatile unsigned int encoder_LH = 0;

void setup() {
  pinMode(RH_ENA, INPUT);  
  pinMode(RH_ENB, INPUT);
  pinMode(LH_ENA, INPUT);
  pinMode(LH_ENB, INPUT);
  digitalWrite(RH_ENA, HIGH);
  digitalWrite(RH_ENB, HIGH);
  digitalWrite(LH_ENA, HIGH);
  digitalWrite(LH_ENB, HIGH);

  pinMode(BR,OUTPUT);
  pinMode(RH_D1,OUTPUT);
  pinMode(RH_D2,OUTPUT);
  pinMode(RH_D3,OUTPUT);
  pinMode(LH_D1,OUTPUT);
  pinMode(LH_D2,OUTPUT);
  pinMode(LH_D3,OUTPUT);
  pinMode(LED_FRT, OUTPUT);

  analogWrite(RH_D1,25);
  analogWrite(LH_D1,25);
  digitalWrite(BR,HIGH);

  Wire.begin();

  Serial.begin(38400);
//  digitalWrite(RH_D2,HIGH);
//  digitalWrite(LH_D2,HIGH);
}

void loop() {

  if(Serial.available()>0) {
    joystick = Serial.parseInt();
    Serial.println(joystick);

    if(joystick == 2) {
      digitalWrite(RH_D2,HIGH);
      digitalWrite(LH_D2,HIGH);
      analogWrite(RH_D1,100);
      analogWrite(LH_D1,100);
      digitalWrite(RH_D3,HIGH);
      digitalWrite(LH_D3,HIGH);
      analogWrite(LED_FRT,100);
    }

    else if(joystick == 4) {
      digitalWrite(RH_D2,HIGH);
      digitalWrite(LH_D2,HIGH);
      analogWrite(RH_D1,200);
      analogWrite(LH_D1,200);
      digitalWrite(RH_D3,HIGH);
      digitalWrite(LH_D3,HIGH);
      analogWrite(LED_FRT,200);
   }

    
  }
                
  
  else {
    analogWrite(RH_D1,100);
    analogWrite(LH_D1,100);
    digitalWrite(RH_D2,LOW);
    digitalWrite(LH_D2,LOW);
    analogWrite(LED_FRT,0);
  }


}
