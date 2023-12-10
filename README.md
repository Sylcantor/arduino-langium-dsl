# Arduino-Langium DSL

This DSL do not instantiate the ArduinoLM kernel, it is reimplemented.
This README provides instructions on how to generate and validate Arduino code using this DSL.

## Getting Started

To get started with Arduino-Langium DSL, you need to run the following commands:

1. **Clone the Repository**:

    Github CLI:
```
gh repo clone Sylcantor/arduino-langium-dsl
````

2. **Install the Dependencies**:

```
npm install
```

3. **Generate the Language Server and CLI**: 

```
npm run langium:generate
```

4. **Build the Project**:

```
npm run build
```

5. **Validate a `.ard` File**:
To validate a `.ard` file using the DSL, use the command:

```
./bin/cli.js parseAndValidate ./scenarios/{your_file}
```

Replace `{your_file}` with the path to your `.ard` file.

6. **Generate Arduino Code**:
To generate Arduino code from a `.ard` file, use the command:

```
./bin/cli.js generateArduinoCode ./scenarios/{your_file}
```

Replace `{your_file}` with the path of your `.ard` file.

You can find the generated code in the [output](./output) folder.

## Basic Scenarios

The DSL comes with four basic scenarios, and one temporal transition scenario located in the [scenarios](./scenarios) folder.
Each scenario use the PIN allocation generator to allocate the pins.

[1. **Very Simple Alarm**](./scenarios/verySimpleAlarm.ard)

Pushing a button activates a LED and a buzzer. Releasing the button switches the actuators off.

[output](./output/verySimpleAlarm.ino)

[2. **Dual-Check Alarm**](./scenarios/dualCheckAlarm.ard)  
  
It will trigger a buzzer if and only if two buttons are pushed at the very same time. Releasing at least one of the buttons stops the sound.

[output](./output/dualCheckAlarm.ino)

[3. **State-Based Alarm**](./scenarios/stateBaseAlarm.ard)  

Pushing the button once switches the system into a mode where the LED is switched on. Pushing it again switches it off.

[output](./output/stateBaseAlarm.ino)

[4. **Multi-State Alarm**](./scenarios/multiStateAlarm.ard)  

Pushing the button starts the buzz noise. Pushing it again stops the buzzer and switches the LED on. Pushing it again switches the LED off, and makes the system ready to make noise again after one push, and so on.

[output](./output/multiStateAlarm.ino)
    
[5. **Temporal Transition**](./scenarios/temporalLedControll.ard)

This extension supports temporal transitions, i.e., transitions that are triggered a specific amount of time after entering a state.

[output](./output/temporalLedControll.ino)

## PIN Allocation Generator

This DSL extension includes a PIN allocation generator that eases this process, considering the technical constraints of the board.
All scenarios in the [scenarios](./scenarios) use this generator to allocate the pins.

## Author

The Arduino-Langium DSL is developed by Nicolas Guiblin.