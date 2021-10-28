int IR1 = A0;  int IR2 = A1; int IR3 = A2;  int SON1 = A3;  int PAN_EN = A4;  int TILT_EN = A5;   int CSENS = A6;         //Analog Input
int LH_ENA = 44; int LH_ENB = 43;int RH_ENA = 46;int RH_ENB = 45;                                                //Digital input Encoder
int CS_STT = 66; int CS_STP = 67; int CS_FWD = 68; int CS_RVR = 69;  int CS_RGT = 49; int CS_LFT = 48;           // Digital Input Console
int LSR_Out1 = 42; int LSR_Out2 = 41; int LSR_Out3 = 40;                                                         // Digital Input Lidar
int ESTOP =39; int SW_Mode = 38;                                                                                 // Digital Input General

int BRAKE = 29; int LH_D2 = 26 ; int LH_D3 = 25 ; int RH_D2 = 28 ; int RH_D3 = 27; int PAN_D1 = 24 ; int PAN_D2 = 23; int TILT_D1 = 2; int TILT_D2 = 3;   // Digital Output
int LH_D1 = 5; int RH_D1 = 4;  int LED_R_LH = 10 ; int LED_G_LH = 11 ; int LED_B_LH = 12 ;int LED_R_RH = 7 ; int LED_G_RH = 8 ; int LED_B_RH = 9 ; //Digital Output (PWM)


#define LH_ENA 44
#define LH_ENB 43
#define RH_ENA 46
#define RH_ENB 45
#define ESTOP 39    

int count = 0;

volatile unsigned int encoder_RH = 0;
volatile unsigned int encoder_LH = 0;

void setup() {
  
  pinMode(LH_ENA, INPUT);  pinMode(LH_ENB, INPUT);pinMode(RH_ENA, INPUT);pinMode(RH_ENB, INPUT);pinMode(SW_Mode,INPUT);pinMode(ESTOP,INPUT);
  digitalWrite(LH_ENA, HIGH); digitalWrite(LH_ENB, HIGH); digitalWrite(RH_ENA, HIGH);digitalWrite(RH_ENB, HIGH); digitalWrite(SW_Mode,HIGH);digitalWrite(ESTOP,HIGH);

  pinMode(CS_STT, INPUT);  pinMode(CS_STP, INPUT);pinMode(CS_FWD, INPUT);pinMode(CS_RVR, INPUT);pinMode(CS_RGT, INPUT);pinMode(CS_LFT, INPUT);
  digitalWrite(CS_STT, HIGH); digitalWrite(CS_STP, HIGH); digitalWrite(CS_FWD, HIGH);digitalWrite(CS_RVR, HIGH); digitalWrite(CS_RGT, HIGH); digitalWrite(CS_LFT, HIGH); 

  
  attachInterrupt(digitalPinToInterrupt(RH_ENA), Encoder_RH_ENA, CHANGE);  //Pin 2
  attachInterrupt(digitalPinToInterrupt(LH_ENA), Encoder_LH_ENA, CHANGE);  //Pin 18
  attachInterrupt(digitalPinToInterrupt(ESTOP),EMG_STOP, HIGH);
  
  pinMode(BRAKE,OUTPUT);pinMode(LH_D2,OUTPUT);pinMode(LH_D3,OUTPUT);pinMode(RH_D2,OUTPUT);pinMode(RH_D3,OUTPUT);pinMode(PAN_D1,OUTPUT);pinMode(PAN_D2,OUTPUT);pinMode(TILT_D1,OUTPUT);pinMode(TILT_D2,OUTPUT);
  pinMode(LH_D1, OUTPUT);pinMode(RH_D1, OUTPUT);pinMode(LED_R_LH,OUTPUT);pinMode(LED_G_LH,OUTPUT);pinMode(LED_B_LH,OUTPUT);pinMode(LED_R_RH,OUTPUT);pinMode(LED_G_RH,OUTPUT);pinMode(LED_B_RH,OUTPUT);

  analogWrite(RH_D1,229);analogWrite(LH_D1,229);digitalWrite(BRAKE,HIGH);
 
  Serial.begin(9600);
  digitalWrite(RH_D2,LOW);digitalWrite(RH_D3,LOW);
  digitalWrite(LH_D2,LOW);digitalWrite(LH_D3,LOW);
}

void set_led_right(int r, int g, int b)
{
    digitalWrite(LED_R_LH,255-r);
    digitalWrite(LED_G_LH,255-g);
    digitalWrite(LED_B_LH,255-b);
}

void set_led_left(int r, int g, int b)
{
    digitalWrite(LED_R_LH,255-r);
    digitalWrite(LED_G_LH,255-g);
    digitalWrite(LED_B_LH,255-b);
}

void loop() {

    set_led_right(0, 255, 0); //RGB
    set_led_left(0, 255, 0);  //RGB
  
    
//Debugging Info
 Serial.print("Mode  = " ); Serial.println(digitalRead(SW_Mode));
 Serial.print("Estop  = " ); Serial.println(digitalRead(ESTOP));
//  
 Serial.print("CS Start,STOP,LH,RH,FWD,REV = " );Serial.print(digitalRead(CS_STT));Serial.print(digitalRead(CS_STP));Serial.print(digitalRead(CS_LFT));
 Serial.print(digitalRead(CS_RGT));Serial.print(digitalRead(CS_FWD));Serial.println(digitalRead(CS_RVR));

 int Analog_IR1 = analogRead(IR1); int Analog_IR2 = analogRead(IR2); int Analog_IR3 = analogRead(IR3);
 /*Serial.print("IR(FWD) = "); Serial.print(Analog_IR1);  Serial.print("\n "); Serial.print("IR (RH) = "); Serial.print(Analog_IR2);  Serial.print("\n ");
 Serial.print("IR (LH) = "); Serial.print(Analog_IR3);  Serial.print("\n "); Serial.print("SON = "); Serial.print(analogRead(SON1));  Serial.print("\n ");
 Serial.print("CSense = "); Serial.print(analogRead(CSENS));Serial.print("\n");
 Serial.print("Pan Angle = "); Serial.print(analogRead(PAN_EN));Serial.print("\n");
 Serial.print("Tilt Angle = "); Serial.print(analogRead(TILT_EN));Serial.print("\n");

 Serial.print("Encoder_LH = "); Serial.print(encoder_LH);  Serial.print("\n ");
 Serial.print("Encoder_RH = "); Serial.print(encoder_RH);  Serial.print("\n ");
 Serial.print("Count "); Serial.print(count);  Serial.print("\n ");*/

 

 if(digitalRead(SW_Mode) == 0){    // 0 = Rescue

 // Serial.print("Rescue Mode");Serial.print("\n");

  if (digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 0 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1 ) {
    //Move forward
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,LOW);
   digitalWrite(LH_D3,HIGH);
   analogWrite(RH_D1,200);
   analogWrite(LH_D1,200);
 //  Serial.print("Move Forward");Serial.print("\n");
  // analogWrite(LED_FRT,100);
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 0 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //move reverse
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,HIGH);
   digitalWrite(LH_D3,LOW);
   analogWrite(RH_D1,200);
   analogWrite(LH_D1,200);
  // analogWrite(LED_FRT,100);
//  Serial.print("Move Reverse");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 1 && digitalRead(CS_RGT) == 0 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //Move differential to the right
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,HIGH);
   digitalWrite(LH_D3,HIGH);
   analogWrite(RH_D1,200);
   analogWrite(LH_D1,200);
 //  analogWrite(LED_FRT,100);
// Serial.print("Move Left");Serial.print("\n");
    
  }
  else if(digitalRead(CS_LFT) == 0 && digitalRead(CS_RGT) == 1 && digitalRead(CS_FWD) == 1 && digitalRead(CS_RVR) == 1 && digitalRead(CS_STT) == 1 && digitalRead(CS_STP) == 1){
    //Move differential to the left
   digitalWrite(RH_D2,HIGH);
   digitalWrite(LH_D2,HIGH);
   digitalWrite(RH_D3,LOW);
   digitalWrite(LH_D3,LOW);
   analogWrite(RH_D1,200);
   analogWrite(LH_D1,200);
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
    analogWrite(RH_D1,229);
    analogWrite(LH_D1,229);
    
  }
  
  
 }

 

 Serial.println("");
 Serial.println("");
      

  
  delay(100);        // delay in between reads for stability
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
    encoder_RH = encoder_RH - 1; //you may need to redefine positive and negative directions
  }
  else
  {
    encoder_RH = encoder_RH + 1;
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
