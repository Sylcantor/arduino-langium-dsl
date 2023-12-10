//import type { Model } from '../language/generated/ast.js';
//import chalk from 'chalk';
import { Command } from 'commander';
import { ArduinoLanguageMetaData } from '../language/generated/module.js';
//import { createArduinoServices } from '../language/arduino-module.js';
//import { extractAstNode } from './cli-util.js';
//import { generateJavaScript } from './generator.js';
//import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parseAndValidate } from './parse-and-validate.js';
import { generateArduinoCode } from './generator.js';
import { createArduinoServices } from '../language/arduino-module.js';
import { extractDocument } from './cli-util.js';
import { Model } from '../language/generated/ast.js';
import { NodeFileSystem } from 'langium/node';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

/*
export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createArduinoServices(NodeFileSystem).Arduino;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};
*/

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = ArduinoLanguageMetaData.fileExtensions.join(', ');

    /*
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);
    */



        program
            .command('generateArduinoCode <file>')
            .description('Génère le code Arduino à partir d’un fichier source')
            .action(async (file) => {
                const filePath = path.resolve(process.cwd(), file);
                const destination = './output';
        
                // Créez les services pour notre langue et extrayez le document pour notre programme
                const services = createArduinoServices(NodeFileSystem).Arduino;
                const document = await extractDocument(filePath, services);
        
                // Utilisez le modèle extrait du document
                const model = document.parseResult.value as Model;
        
                // Appeler generateArduinoCode avec le modèle, filePath et destination
                generateArduinoCode(model, filePath, destination);
            });
    
    program
        .command('parseAndValidate')
        .argument('<file>', `source file to parse & validate (ending in ${fileExtensions})`)
        .description('Indicates where a program parses & validates successfully, but produces no output code')
        .action(parseAndValidate);

    program.parse(process.argv);
}
