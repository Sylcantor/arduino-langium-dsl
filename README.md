# Arduino-Langium DSL

This DSL do not instantiate the ArduinoLM kernel, it is reimplemented.
This README provides instructions on how to generate and validate Arduino code using this DSL.

## Getting Started

To get started with Arduino-Langium DSL, you need to run the following commands:

1. **Generate the Language Server and CLI**: 

```
npm run langium:generate
```

2. **Build the Project**:

```
npm run build
```

3. **Validate a `.ard` File**:
To validate a `.ard` file using the DSL, use the command:

```
./bin/cli.js parseAndValidate ./scenarios/{your_file}
```

Replace `{your_file}` with the path to your `.ard` file.

4. **Generate Arduino Code**:
To generate Arduino code from a `.ard` file, use the command:

```
./bin/cli.js generateArduinoCode ./scenarios/{your_file}
```

Replace `{your_file}` with the path of your `.ard` file.

## Basic Scenarios

The DSL comes with four basic scenarios, and one temporal transition scenario located in the `scenarios` folder:
Each scenario use the PIN allocation generator to allocate the pins.

1. **Very Simple Alarm**: Pushing a button activates a LED and a buzzer. Releasing the button switches the actuators off.

2. **Dual-Check Alarm**: It will trigger a buzzer if and only if two buttons are pushed at the very same time. Releasing at least one of the buttons stops the sound.

3. **State-Based Alarm**: Pushing the button once switches the system into a mode where the LED is switched on. Pushing it again switches it off.

4. **Multi-State Alarm**: Pushing the button starts the buzz noise. Pushing it again stops the buzzer and switches the LED on. Pushing it again switches the LED off, and makes the system ready to make noise again after one push, and so on.

## Temporal Transitions

This extension supports temporal transitions, i.e., transitions that are triggered a specific amount of time after entering a state.

## PIN Allocation Generator

This DSL extension includes a PIN allocation generator that eases this process, considering the technical constraints of the board.
All scenarios in the `scenarios` use this generator to allocate the pins.

## Author

The Arduino-Langium DSL is developed by Nicolas Guiblin.