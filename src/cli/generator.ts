    import { type Model, type BrickType, type Brick, type State, type Action, type Transition, type App } from '../language/generated/ast.js';

    import * as fs from 'node:fs';
    import { CompositeGeneratorNode, NL, toString } from 'langium';
    import * as path from 'node:path';
    import { extractDestinationAndName } from './cli-util.js';

    
    function indent(line: string, level: number): string {
        const indentation = '    '; // 4 espaces pour une indentation
        return indentation.repeat(level) + line;
    }
    
    export function generateArduinoCode(model: Model, filePath: string, destination: string | undefined): string {
        const data = extractDestinationAndName(filePath, destination);
        const generatedFilePath = `${path.join(data.destination, data.name)}.ino`;

        const fileNode = new CompositeGeneratorNode();
        const pinManager = new PinManager();

        const app = model.elements.find(e => e.$type === 'App');
        if (!app) {
            throw new Error('No App found in the model');
        }

        generateAppCode(app, fileNode, pinManager);

        app?.states.forEach(state => {
            generateStateCode(state, fileNode, pinManager);
        });

         // Générer la fonction loop
        const initialStateName = app?.initialState.ref?.name;
        fileNode.append('void loop() {', NL);
        if (initialStateName) {
            fileNode.append(`  ${initialStateName}();`, NL);
        }
        fileNode.append('}', NL);

        if (!fs.existsSync(data.destination)) {
            fs.mkdirSync(data.destination, { recursive: true });
        }
        fs.writeFileSync(generatedFilePath, toString(fileNode));
        return generatedFilePath;
    }


    function generateAppCode(app: App, fileNode: CompositeGeneratorNode, pinManager: PinManager) {
        fileNode.append(`// Code for App: ${app.name}`, NL);
        fileNode.append(pinManager.generatePinAllocationComments(app), NL);
        fileNode.append('void setup() {', NL);

        // Générer le code pour la configuration des briques
        app.bricks.forEach((brick: Brick) => {
            generateBrickSetup(brick, fileNode, pinManager);
        });
        fileNode.append('}', NL, NL);
    }

    function generateBrickSetup(brick : Brick, fileNode : CompositeGeneratorNode, pinManager : PinManager) {
        let pin = pinManager.allocatePin(brick);
        let brickType = brick.type.SENSOR ? 'SENSOR' : brick.type.ACTUATOR ? 'ACTUATOR' : null;
    
        if (brickType === 'SENSOR') {
            fileNode.append(indent(`pinMode(${pin}, INPUT);`, 1), NL);
        } else if (brickType === 'ACTUATOR') {
            fileNode.append(indent(`pinMode(${pin}, OUTPUT);`, 1), NL);
            if (brick.initialState) {
                let initialState = brick.initialState === 'HIGH' ? 'HIGH' : 'LOW';
                fileNode.append(indent(`digitalWrite(${pin}, ${initialState});`, 1), NL);
            }
        }
    }
    

    function generateStateCode(state: State, fileNode: CompositeGeneratorNode, pinManager: PinManager) {
        fileNode.append(`void ${state.name}() {`, NL);

        // Générer le code pour chaque action dans l'état
        state.actions.forEach((action: Action) => {
            generateActionCode(action, fileNode, pinManager);
        });

        // Générer le code pour chaque transition dans l'état
        state.transitions.forEach((transition: Transition) => {
            generateTransitionCode(transition, fileNode, pinManager);
        });

        fileNode.append('}', NL, NL);
    }

    function generateActionCode(action: Action, fileNode: CompositeGeneratorNode, pinManager: PinManager) {
        let brickName = action.brick.ref?.name;
        let pin = brickName ? pinManager.getPinForBrick(brickName) : '';
        if (pin) {
            fileNode.append(indent(`digitalWrite(${pin}, ${action.value});`, 1), NL);
        }
    }

    function generateTransitionCode(transition: Transition, fileNode: CompositeGeneratorNode, pinManager: PinManager) {
        if (transition.$type === 'TemporalTransition') {
            fileNode.append(indent(`delay(${transition.duration});`, 1), NL);
            fileNode.append(indent(`${transition.state.ref?.name}();`, 1), NL);
        } else if (transition.$type === 'PinAllocatedTransition') {
            const conditionExpressions = transition.conditions.map(condition => {
                const pin = pinManager.getPinForBrick(condition.brick.ref?.name || '');
                switch (condition.conditionValue?.value) {
                    case 'HIGH':
                        return `digitalRead(${pin}) == HIGH`;
                    case 'LOW':
                        return `digitalRead(${pin}) == LOW`;
                    default:
                        return `analogRead(${pin}) == ${condition.conditionValue?.value}`;
                }
            }).join(' && ');

            if (conditionExpressions) {
                fileNode.append(indent(`if (${conditionExpressions}) {`, 1), NL);
                fileNode.append(indent(`${transition.state.ref?.name}();`, 2), NL);
                fileNode.append(indent('}', 1), NL);
            }
        }
    }

    class PinManager {
        usedPins: Set<number>;
        pinAllocation: Map<string, number>;
        analogInputPins: number[];
        analogOutputPins: number[];

        constructor() {
            this.usedPins = new Set();
            this.pinAllocation = new Map();
            this.analogInputPins = [14, 15, 16, 17, 18]; // Correspond à A0, A1, A2, A3, A4, A5 pour Arduino Uno
            this.analogOutputPins = [9, 10, 11]; // Correspond à D9, D10, D11
        }

        allocatePin(brick: { name: string; type: BrickType; }) {
            console.log(`Tentative d'allocation d'une broche pour la brique: ${brick.name}`);

            let brickType = this.determineBrickType(brick.type);
            console.log(`Type de brique détecté: ${brickType}`);

            if (!brickType) {
                throw new Error(`Type inconnu pour la brique: ${brick.name}`);
            }

            let pinOptions = brickType === 'SENSOR' ? this.analogInputPins : this.analogOutputPins;
            console.log(`Options de broche pour ${brickType}: ${pinOptions}`);

            let pin = this.findAvailablePin(pinOptions);

            if (pin !== undefined) {
                this.usedPins.add(pin);
                this.pinAllocation.set(brick.name, pin);
                console.log(`Broche allouée à ${brick.name}: ${pin}`);
            } else {
                console.log(`Broches utilisées: ${[...this.usedPins].join(', ')}`);
                console.log(`Aucune broche disponible pour ${brickType}`);
                throw new Error(`No available pin for brick: ${brick.name}`);
            }

            return pin;
        }

        determineBrickType(brickType: BrickType): string | null {
            return brickType.SENSOR ? 'SENSOR' : brickType.ACTUATOR ? 'ACTUATOR' : null;
        }

        findAvailablePin(pinOptions: number[]) {
            console.log(`Recherche d'une broche disponible parmi: ${pinOptions}`);
            for (const pin of pinOptions) {
                if (!this.usedPins.has(pin)) {
                    console.log(`Broche disponible trouvée: ${pin}`);
                    return pin;
                }
            }
            console.log("Aucune broche disponible trouvée");
            return undefined;
        }

        getPinForBrick(brickName: string) {
            return this.pinAllocation.get(brickName);
        }

        generatePinAllocationComments(app: { name: any; }) {
            let comments = `// Pin Allocation for ${app.name}\n`;
            this.pinAllocation.forEach((pin, brickName) => {
                comments += `// ${brickName} is allocated to pin ${pin}\n`;
            });
            return comments;
        }
    }