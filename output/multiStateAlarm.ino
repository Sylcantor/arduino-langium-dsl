// Code for App: MultiStateAlarm
// Pin Allocation for MultiStateAlarm

void setup() {
    pinMode(14, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
    pinMode(10, OUTPUT);
    digitalWrite(10, LOW);
}

void readyToBuzz() {
    if (digitalRead(14) == HIGH) {
        buzzing();
    }
}

void buzzing() {
    digitalWrite(9, HIGH);
    delay(500);
    waitForLed();
}

void waitForLed() {
    if (digitalRead(14) == HIGH) {
        turnOnLed();
    }
}

void turnOnLed() {
    digitalWrite(9, LOW);
    digitalWrite(10, HIGH);
    delay(500);
    waitForOff();
}

void waitForOff() {
    if (digitalRead(14) == HIGH) {
        readyToBuzz();
    }
}

void loop() {
  readyToBuzz();
}
