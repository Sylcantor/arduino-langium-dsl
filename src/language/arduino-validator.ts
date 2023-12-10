import { ValidationAcceptor, ValidationChecks, ValidationRegistry } from 'langium';
import { ArduinoAstType } from './generated/ast.js';
import { ArduinoServices } from './arduino-module.js';

export class ArduinoValidator {

    // Inject dependencies if needed
    constructor(protected readonly services: ArduinoServices) {}

    // Validation for App
    checkApp(app: ArduinoAstType['App'], accept: ValidationAcceptor): void {
        if (!app.name) {
            accept('error', 'App must have a name.', { node: app, property: 'name' });
        }
        // Add more app-specific validations here
    }

    // Validation for Brick
    checkBrick(brick: ArduinoAstType['Brick'], accept: ValidationAcceptor): void {
        // Example validation: check if brick name is unique
        // ...
        if (brick.name === 'foo') {
            accept('warning', 'Brick name should not be "foo".', { node: brick, property: 'name' });
        }
    }

    // Validation for State
    checkState(state: ArduinoAstType['State'], accept: ValidationAcceptor): void {
        // Example validation: check if state has at least one action or transition
        // ...
        if (state.actions.length === 0 && state.transitions.length === 0) {
            accept('error', 'State must have at least one action or transition.', { node: state, property: 'actions' });
        }
    }

    // Validation for Transition
    checkTransition(transition: ArduinoAstType['Transition'], accept: ValidationAcceptor): void {
        // Example validation: check if transition 'to' state exists
        // ...
        //if (transition.to === undefined) {
          //  accept('error', 'Transition must have a "to" state.', { node: transition: 'to' });
        //}
    }

    // Validation for Action
    checkAction(action: ArduinoAstType['Action'], accept: ValidationAcceptor): void {
        // Example validation: check if action value is within a valid range
        // ...
        if (action.value === 'foo') {
            accept('warning', 'Action value should not be "foo".', { node: action, property: 'value' });
        }
    }

    // Register all your checks here
    registerChecks(registry: ValidationRegistry): void {
        const checks: ValidationChecks<ArduinoAstType> = {
            App: this.checkApp,
            Brick: this.checkBrick,
            State: this.checkState,
            Transition: this.checkTransition,
            Action: this.checkAction
        };
        registry.register(checks, this);
    }
}

export function registerValidationChecks(services: ArduinoServices): void {
    const validator = new ArduinoValidator(services);
    services.validation.ValidationRegistry.register(validator.registerChecks.bind(validator));
}
