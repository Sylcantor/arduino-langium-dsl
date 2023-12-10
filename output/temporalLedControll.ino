// Code for App: TemporalLEDControl
// Pin Allocation for TemporalLEDControl

void setup() {
    pinMode(14, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
}

void waitingForPress() {
    if (digitalRead(14) == HIGH) {
        turnOnLed();
    }
}

void turnOnLed() {
    digitalWrite(9, HIGH);
    delay(800);
    turnOffLed();
}

void turnOffLed() {
    digitalWrite(9, LOW);
}

void loop() {
  waitingForPress();
}
