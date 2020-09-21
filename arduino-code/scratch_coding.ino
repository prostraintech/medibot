const int RH_D1 = 4;
const int RH_D2 = 34;
const int RH_D3 = 35;
const int LH_D1 = 5;
const int LH_D2 = 36;
const int LH_D3 = 37;
const int LED_FRT = 7;

int cmd = 0;
int heartbeat = 0;
int joystick;
int count = 0;

unsigned long int startMillis;            // to provide delay when pressing pendant REVERSE
unsigned long int currentMillis;

void setup() {
  
  pinMode(RH_D1,OUTPUT);
  pinMode(RH_D2,OUTPUT);
  pinMode(RH_D3,OUTPUT);
  pinMode(LH_D1,OUTPUT);
  pinMode(LH_D2,OUTPUT);
  pinMode(LH_D3,OUTPUT);
  pinMode(LED_FRT, OUTPUT);

  analogWrite(RH_D1,30);
  analogWrite(LH_D1,30);
  Serial.begin(9600);
  digitalWrite(RH_D2,HIGH);
  digitalWrite(LH_D2,HIGH);

}

void loop() {
  
  if(Serial.available()>0) {
    joystick = Serial.parseInt();
//    Serial.print(joystick);
//    Serial.print("\n");
    
      heartbeat = 0;

//    startMillis = millis();
    
    if (cmd != joystick && joystick != 0) {
      cmd = joystick; 
      } 
   }
  
  heartbeat++;
//   currentMillis = millis();
    
  if (heartbeat == 500) {
    cmd = 8;
    heartbeat = 0;
  }
     
//  Serial.print(cmd);
//  Serial.print("\t");
//  Serial.print(heartbeat); 
//  Serial.print("\n");

      if(cmd == 1) {           //slow forward
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,100);
      }

      else if(cmd == 2) {      //fast forward
        analogWrite(RH_D1,200);
        analogWrite(LH_D1,200);
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,HIGH);
        analogWrite(LED_FRT,200);
      }

      else if(cmd == 3) {        //rotate clockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,HIGH);
      }
  
      else if(cmd == 4) {        //rotate cclockwise
        analogWrite(RH_D1,80);
        analogWrite(LH_D1,80);
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        digitalWrite(RH_D3,HIGH);
        digitalWrite(LH_D3,LOW);    
      }
  
      else if(cmd == 7) {       //reverse
        analogWrite(RH_D1,100);
        analogWrite(LH_D1,100);
        digitalWrite(RH_D2,LOW);
        digitalWrite(LH_D2,LOW);
        digitalWrite(RH_D3,LOW);
        digitalWrite(LH_D3,LOW);
        analogWrite(LED_FRT,50);
      }
  
      else if (cmd==8) {       //stop
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        analogWrite(LED_FRT,50);
      }  
      
      else {                        //stop
        digitalWrite(RH_D2,HIGH);
        digitalWrite(LH_D2,HIGH);
        analogWrite(RH_D1,50);
        analogWrite(LH_D1,50);
        analogWrite(LED_FRT,50);
      }
}
