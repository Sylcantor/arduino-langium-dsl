// Code for App: VerySimpleAlarm
// Pin Allocation for VerySimpleAlarm

void setup() {
    pinMode(14, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
    pinMode(10, OUTPUT);
    digitalWrite(10, LOW);
}

void alarmOff() {
    if (digitalRead(14) == HIGH) {
        alarmOn();
    }
}

void alarmOn() {
    digitalWrite(9, HIGH);
    digitalWrite(10, HIGH);
    if (digitalRead(14) == LOW) {
        alarmOff();
    }
}

void loop() {
  alarmOff();
}
