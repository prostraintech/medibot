  void motor(int movement)
  {
    if (movement == 1 || movement == 2 || movement == 3 || movement == 4)
    {
      if (movement == 1)  // forward
      {
        digitalWrite(RH_D2,HIGH);digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);digitalWrite(LH_D3,LOW);
        analogWrite(RH_D1,125);analogWrite(LH_D1,125);
        Serial.println("forward");
      }

      else if (movement == 2)  // forward slow
      {
        digitalWrite(RH_D2,HIGH);digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);digitalWrite(LH_D3,LOW);
        analogWrite(RH_D1,90);analogWrite(LH_D1,90);
        Serial.println("forward slow");
      }

      else if(movement == 3)  // reverse
      {
        digitalWrite(RH_D2,HIGH);digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);digitalWrite(LH_D3,HIGH);
        analogWrite(RH_D1,90);analogWrite(LH_D1,90);
        Serial.println("reverse");
      }

      else if(movement == 4)  // right
      {
        digitalWrite(RH_D2,HIGH);digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,HIGH);digitalWrite(LH_D3,LOW);
        analogWrite(RH_D1,90);analogWrite(LH_D1,90);
        Serial.println("right");
      }

      else if(movement == 5)  // left
      {
        digitalWrite(RH_D2,HIGH);digitalWrite(LH_D2,HIGH);
        digitalWrite(RH_D3,LOW);digitalWrite(LH_D3,HIGH);
        analogWrite(RH_D1,90);analogWrite(LH_D1,90);
        Serial.println("left");
      }

      else if(movement == 6)  // pan left
      {
        digitalWrite(PAN_D1,HIGH);
        digitalWrite(PAN_D2,HIGH);
        digitalWrite(TILT_D1,LOW);
        Serial.println("pan left");
      }

      else if(movement == 7)  // pan right
      {
        digitalWrite(PAN_D1,HIGH);
        digitalWrite(PAN_D2,LOW);
        digitalWrite(TILT_D1, LOW);
        Serial.println("pan right");
      }

      else if(movement == 8)  // tilt down
      {
        digitalWrite(TILT_D1,HIGH);
        digitalWrite(TILT_D2,HIGH);
        digitalWrite(PAN_D1, LOW);
        Serial.println("tilt up");
      }

      else if(movement == 9)  // tilt down
      {
        digitalWrite(TILT_D1,HIGH);
        digitalWrite(TILT_D2,LOW);
        digitalWrite(PAN_D1, LOW);
        Serial.println("tilt down");
      }

      digitalWrite(LED_R_LH,0);digitalWrite(LED_R_RH,0);
      digitalWrite(LED_G_LH,0);digitalWrite(LED_G_RH,0);
      digitalWrite(LED_B_LH,254);digitalWrite(LED_B_RH,254);      
    }
    
    else 
    {
    //Stop all motors
      digitalWrite(LH_D2,LOW);digitalWrite(RH_D2,LOW);
      analogWrite(RH_D1,25);analogWrite(LH_D1,25);
      Serial.println("stop");

      digitalWrite(LED_R_LH,254);digitalWrite(LED_R_RH,254);
      digitalWrite(LED_G_LH,254);digitalWrite(LED_G_RH,254);
      digitalWrite(LED_B_LH,254);digitalWrite(LED_B_RH,254);
           
    }
       
}
