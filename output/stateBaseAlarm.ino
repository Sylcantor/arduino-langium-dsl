// Code for App: StateBasedAlarm
// Pin Allocation for StateBasedAlarm

void setup() {
    pinMode(14, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
}

void ledOff() {
    if (digitalRead(14) == HIGH) {
        ledOn();
    }
}

void ledOn() {
    digitalWrite(9, HIGH);
    delay(500);
    waitForOff();
}

void waitForOff() {
    if (digitalRead(14) == HIGH) {
        ledOff();
    }
}

void loop() {
  ledOff();
}
