// Code for App: TemporalTransition
// Pin Allocation for TemporalTransition

void setup() {
    pinMode(14, INPUT);
    pinMode(15, INPUT);
    pinMode(9, OUTPUT);
    digitalWrite(9, LOW);
    pinMode(10, OUTPUT);
    digitalWrite(10, LOW);
}

void initialState() {
    if (digitalRead(9) == LOW) {
        secondState();
    }
}

void secondState() {
    digitalWrite(9, HIGH);
    delay(500);
    thirdState();
}

void thirdState() {
    digitalWrite(10, HIGH);
    delay(500);
    fourthState();
}

void fourthState() {
    digitalWrite(9, LOW);
}

void loop() {
  initialState();
}
