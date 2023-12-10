// Code for App: DualCheckAlarm
// Pin Allocation for DualCheckAlarm

void setup() {
    pinMode(14, INPUT);
    pinMode(15, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
}

void alarmOff() {
    if (digitalRead(14) == HIGH && digitalRead(15) == HIGH) {
        alarmOn();
    }
}

void alarmOn() {
    digitalWrite(9, HIGH);
    if (digitalRead(14) == LOW) {
        alarmOff();
    }
    if (digitalRead(15) == LOW) {
        alarmOff();
    }
}

void loop() {
  alarmOff();
}
