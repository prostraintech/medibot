int IR1 = 4;  int IR2 = 5; int IR3 = 6;  int LH_A1 = 2;  int LH_A2 = 3;  int RH_A1 = 0;   int RH_A2 = 1;         //Analog Input
int LH_ENA = 46; int LH_ENB = 45;int RH_ENA = 44;int RH_ENB = 43;                                                //Digital input Encoder
int CS_STT = 42; int CS_STP = 41; int CS_FWD = 40; int CS_RVR = 32;  int CS_RGT = 31; int CS_LFT = 30;           // Digital Input Console
int LSR_Out1 = 49; int LSR_Out2 = 48; int LSR_Out3 = 47;                                                         // Digital Input Lidar
int ESTOP =39; int SW_Mode = 38; int PAN_EN= 37; int TILT_EN = 36;                                               // Digital Input General

int BRAKE = 29; int LH_D2 = 28 ; int LH_D3 = 27 ; int RH_D2 = 26 ; int RH_D3 = 25; int PAN_D1 = 24 ; int PAN_D2 = 23; int TILT_D1 = 22; int TILT_D2 = 2;   // Digital Output
int LH_D1 = 3; int RH_D1 = 4;  int LED_R_LH = 7 ; int LED_G_LH = 8 ; int LED_B_LH = 9 ;int LED_R_RH = 10 ; int LED_G_RH = 11 ; int LED_B_RH = 12 ; //Digital Output (PWM)


#define LH_ENA 66
#define LH_ENB 67
#define RH_ENA 68
#define RH_ENB 69
#define ESTOP 39    

int count = 0;

volatile unsigned int encoder_RH = 0;
volatile unsigned int encoder_LH = 0;

void setup() {
  
  pinMode(LH_ENA, INPUT);  pinMode(LH_ENA, INPUT);pinMode(RH_ENA, INPUT);pinMode(RH_ENB, INPUT);
  digitalWrite(LH_ENA, HIGH); digitalWrite(LH_ENB, HIGH); digitalWrite(RH_ENA, HIGH);digitalWrite(RH_ENB, HIGH); 

  pinMode(CS_STT, INPUT);  pinMode(CS_STP, INPUT);pinMode(CS_FWD, INPUT);pinMode(CS_RVR, INPUT);pinMode(CS_RGT, INPUT);pinMode(CS_LFT, INPUT);
  digitalWrite(CS_STT, HIGH); digitalWrite(CS_STP, HIGH); digitalWrite(CS_FWD, HIGH);digitalWrite(CS_RVR, HIGH); digitalWrite(CS_RGT, HIGH); digitalWrite(CS_LFT, HIGH); 

  
  attachInterrupt(0, Encoder_RH_ENA, CHANGE);  //Pin 2
  attachInterrupt(5, Encoder_LH_ENA, CHANGE);  //Pin 18
  attachInterrupt(digitalPinToInterrupt(ESTOP),EMG_STOP, HIGH);
  
  pinMode(BRAKE,OUTPUT);pinMode(LH_D2,OUTPUT);pinMode(LH_D3,OUTPUT);pinMode(RH_D2,OUTPUT);pinMode(RH_D3,OUTPUT);pinMode(PAN_D1,OUTPUT);pinMode(PAN_D2,OUTPUT);pinMode(TILT_D1,OUTPUT);pinMode(TILT_D2,OUTPUT);
  pinMode(LH_D1, OUTPUT);pinMode(RH_D1, OUTPUT);pinMode(LED_R_LH,OUTPUT);pinMode(LED_G_LH,OUTPUT);pinMode(LED_B_LH,OUTPUT);pinMode(LED_R_RH,OUTPUT);pinMode(LED_G_RH,OUTPUT);pinMode(LED_B_RH,OUTPUT);

  analogWrite(RH_D1,25);analogWrite(LH_D1,25);digitalWrite(BRAKE,HIGH);
 
  Serial.begin(9600);
  digitalWrite(RH_D2,HIGH);digitalWrite(RH_D3,HIGH);
  digitalWrite(LH_D2,HIGH);digitalWrite(LH_D3,HIGH);
}


void loop() {

  
    digitalWrite(LED_R_LH,0);
    digitalWrite(LED_G_LH,0);
    digitalWrite(LED_B_LH,254);
    digitalWrite(LED_R_RH,0);
    digitalWrite(LED_G_RH,0);
    digitalWrite(LED_B_RH,254);
  

  

 
//  int Analog_IR1 = analogRead(IR1); int Analog_IR2 = analogRead(IR2); int Analog_IR3 = analogRead(IR3);
//
//  Serial.print("Mode  = " ); Serial.print(digitalRead(SW_Mode)); Serial.print("\n ");
//  Serial.print("Estop  = " ); Serial.print(digitalRead(ESTOP)); Serial.print("\n ");
//  
//  Serial.print("CS Start,STOP,LH,RH,FWD,REV = " );Serial.print(digitalRead(CS_STT));Serial.print(digitalRead(CS_STP));Serial.print(digitalRead(CS_LFT));
//  Serial.print(digitalRead(CS_RGT));Serial.print(digitalRead(CS_FWD));Serial.print(digitalRead(CS_RVR));Serial.print("\n");
//   
//  Serial.print("IR1 = "); Serial.print(Analog_IR1);  Serial.print("\t ");
//  Serial.print("IR2 = "); Serial.print(Analog_IR2);  Serial.print("\n ");
//  Serial.print("IR3 = "); Serial.print(Analog_IR3);  Serial.print("\n ");
//  Serial.print("IR3 = "); Serial.print(Analog_IR3);  Serial.print("\n ");
//  Serial.print("Encoder_LH = "); Serial.print(encoder_LH);  Serial.print("\n ");
//  Serial.print("Encoder_RH = "); Serial.print(encoder_RH);  Serial.print("\n ");
//  Serial.print("Count "); Serial.print(count);  Serial.print("\n ");

 if(digitalRead(SW_Mode) == 1){    // 0 = Rescue

 // Serial.print("Rescue Mode");Serial.print("\n");

  if (digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 0 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1 ) {
    //Move forward
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,LOW);
   digitalWrite(LH_D3,LOW);
   analogWrite(RH_D1,125);
   analogWrite(LH_D1,125);
 //  Serial.print("Move Forward");Serial.print("\n");
  // analogWrite(LED_FRT,100);
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 0 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //move reverse
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,HIGH);
   digitalWrite(LH_D3,HIGH);
   analogWrite(RH_D1,90);
   analogWrite(LH_D1,90);
  // analogWrite(LED_FRT,100);
//  Serial.print("Move Reverse");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 0 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //Move differential to the right
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,HIGH);
   digitalWrite(LH_D3,LOW);
   analogWrite(RH_D1,90);
   analogWrite(LH_D1,90);
 //  analogWrite(LED_FRT,100);
// Serial.print("Move Left");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 0 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //Move differential to the left
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,LOW);
   digitalWrite(LH_D3,HIGH);
   analogWrite(RH_D1,90);
   analogWrite(LH_D1,90);
 //  analogWrite(LED_FRT,100);
// Serial.print("Move Right");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 0 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 0 && digitalRead(CS_STP) == 1){
    //Move pan to the left
    digitalWrite(PAN_D1,HIGH);
    digitalWrite(PAN_D2,HIGH);
    digitalWrite(TILT_D1, LOW);
  //  Serial.print("Pan Left");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 0 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 0 && digitalRead(CS_STP) == 1){
    //move pan to the right
    digitalWrite(PAN_D1,HIGH);
    digitalWrite(PAN_D2,LOW);
    digitalWrite(TILT_D1, LOW);
  //  Serial.print("Pan Right");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 0 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 0){
    //Move tilt up
    digitalWrite(TILT_D1,HIGH);
    digitalWrite(TILT_D2,HIGH);
    digitalWrite(PAN_D1, LOW);
  //  Serial.print("Tilt Up");Serial.print("\n");
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 0 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 0){
    //Move tilt down
    digitalWrite(TILT_D1,HIGH);
    digitalWrite(TILT_D2,LOW);
    digitalWrite(PAN_D1, LOW);
  //  Serial.print("Tilt Down");Serial.print("\n");
  }

  else {
    //Stop all motors
    digitalWrite(TILT_D1,LOW);
    digitalWrite(PAN_D1,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D2,LOW);
    analogWrite(RH_D1,25);
    analogWrite(LH_D1,25);
    
  }
  
  
 }

//  Serial.println("");
 // Serial.println("");
      

  
  delay(1);        // delay in between reads for stability
  count ++;

}  


void EMG_STOP(){

    digitalWrite(LED_R_LH,254);
    digitalWrite(LED_G_LH,0);
    digitalWrite(LED_B_LH,0);
    digitalWrite(LED_R_RH,254);
    digitalWrite(LED_G_RH,0);
    digitalWrite(LED_B_RH,0);

    digitalWrite(TILT_D1,LOW);
    digitalWrite(PAN_D1,LOW);
    digitalWrite(LH_D2,LOW);
    digitalWrite(RH_D2,LOW);

}

void Encoder_RH_ENA() 
{ 
  if(digitalRead(RH_ENB) == digitalRead(RH_ENA) )
  {
    encoder_RH = encoder_RH + 1; //you may need to redefine positive and negative directions
  }
  else
  {
    encoder_RH = encoder_RH - 1;
  }
}

void Encoder_LH_ENA() 
{ 
  if(digitalRead(LH_ENB) == digitalRead(LH_ENA) )
  {
    encoder_LH = encoder_LH - 1; //you may need to redefine positive and negative directions
  }
  else
  {
    encoder_LH = encoder_LH + 1;
  }
}
