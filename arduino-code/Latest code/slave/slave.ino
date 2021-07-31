#include <Wire.h>

const int SON1_2SC = A1;
const int SON2_2SC = A2;
const int NTC1 = A4;
const int BA1 = A6;
const int BA2 = A7;
int avgrange = 10;
float sonar1=0;
float sum_son1=0 ;
float sonar2=0;
float sum_son2=0;
int SON = 0;
double temp1=0;
float sum_temp1 = 0;
float bat1=0;
float sum_bat1 = 0;
float bat2=0;
float sum_bat2 = 0;
double vNTC;
double rNTC;
int DC1;
int DC2;
int tKelvin1; 
int tCelcius1;
int heartbeat;


int table[] = {0,0};

void setup() {
  Serial.begin(9600);
  Wire.begin(8);
  Wire.onRequest(requestEvent);
}

void loop() {  
  
  for (int i=0; i< avgrange; i++) {
    sonar1 = analogRead(SON1_2SC);
    sum_son1 += sonar1; 
    sonar2 = analogRead(SON2_2SC);
    sum_son2 += sonar2;
  }

  table[0] = (sum_son1/avgrange);
  table[1] = (sum_son2/avgrange);

  for (int i=0; i< avgrange; i++) {
    bat1 = analogRead(BA1);
    sum_bat1 += bat1;
    bat2 = analogRead(BA2);
    sum_bat2 += bat2;
  }
  
  bat1 = (sum_bat1/avgrange);
  bat2 = (sum_bat2/avgrange);
  
  for (int i=0; i< avgrange; i++) {
    temp1 = analogRead(NTC1);
    sum_temp1 += temp1; 
  }

  temp1 = (sum_temp1/avgrange);

  if (table[0] >= 100 && table[1] >= 100) {     //permissible
    SON = 1;
  }

  else if (table[0] < 100 || table[1] < 100) {    //impermissible
    SON = 0;
  }

  heartbeat++;

  if (heartbeat > 32000) {
    DC1 = (bat1/1023)*5*8.3;
    DC2 = (bat2/1023)*5*4;
    heartbeat = 0;
  }

  vNTC = (temp1/1023)*5;
  rNTC = ((5*vNTC)/(5-vNTC))*1000;
  tKelvin1 = (3974*298.15)/(3974+(298.15*log(rNTC/10000)));
  tCelcius1 = tKelvin1 - 273;

  sum_son1 = 0;
  sum_son2 = 0;
  sum_bat1 = 0;
  sum_bat2 = 0;
  sum_temp1 = 0;
}

void requestEvent() {
  uint8_t Buffer[3];
  Buffer[0] = SON;
  Buffer[1] = DC1;
  Buffer[2] = tCelcius1;

//  Serial.print(Buffer[0]); Serial.print("\t"); 
//  Serial.print(Buffer[1]); Serial.print("\t");
//  Serial.print(Buffer[2]); Serial.print("\n");

  Wire.write(Buffer,3);
}
