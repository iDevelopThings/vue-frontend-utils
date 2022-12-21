import {type ResolvedConfig} from "vite";
import {PluginConfig} from "./PluginConfig";
import {TS} from "./TS";
import ts from "typescript";
import {generateInterfaceDeclaration} from "./Builders/Interfaces";
import {generateDefinitions} from "./Builders/ModalInformation";

export type DefinitionInfo = {
	varName: string,
	type: string,
	name: string;
	typeInfo: TypeInfo;
}

export type TypeInfo = { type?: ts.Type, typeRef?: ts.TypeNode };

export type ModalDefinitionInfo = DefinitionInfo & {
	type: "modal",
};

export class PluginContextInstance {

	private _viteConfig: ResolvedConfig;


	public init(config: ResolvedConfig) {
		this._viteConfig = config;

		PluginConfig.init(config);
		TS.setup();

		this.loadModules();
	}

	public loadModules() {
		const fileNames = PluginConfig.tsConfig.fileNames;
		const sources   = TS.program.getSourceFiles();

		const definitions: { [key: string]: DefinitionInfo } = {};


		for (let fileName of fileNames) {
			const source = TS.program.getSourceFile(fileName);
			if (!source) {
				console.error(`Could not find source file ${fileName}`);
				continue;
			}

			for (let statement of source.statements) {
				// We need to search for `defineModal` and `defineEvent` calls

				function isDefineCall(node: ts.Node): node is ts.CallExpression {
					if (ts.isCallExpression(node)) {
						if (ts.isIdentifier(node.expression)) {
							return node.expression.text === "defineModal" || node.expression.text === "defineEvent";
						}
					}

					return false;
				}

				function visit(node) {
					if (!isDefineCall(node)) {
						return ts.forEachChild(node, visit);
					}

					const expression = node.expression;
					if (!ts.isIdentifier(expression)) return node;

					const symbol = TS.typeChecker.getSymbolAtLocation(expression);
					const type   = TS.typeChecker.getTypeAtLocation(expression);

					const varName = ts.isVariableDeclaration(node.parent)
						? node?.parent?.name?.getText()
						: null;

					const typeInfo: { type?: ts.Type, typeRef?: ts.TypeNode } = {};

					if (node.typeArguments?.length) {
						typeInfo.type = TS.typeChecker.getTypeAtLocation(node.typeArguments[0]);

						if (ts.isTypeReferenceNode(node.typeArguments[0])) {
							typeInfo.typeRef = node.typeArguments[0];
						} else {
//							data.typeName = toPascalCase(`DefineModal_${data.varName}`);
//							data.typeDec  = generateInterfaceDeclaration(type, data.typeName);
						}
					}

					if (expression.text === "defineModal") {
						definitions[varName] = {
							varName,
							type : "modal",
							typeInfo,
							name : node.arguments[0].getText(),
						} as ModalDefinitionInfo;
					} else if (expression.text === "defineEvent") {
						definitions[varName] = {
							varName,
							type : "event",
							name : node.arguments[0].getText(),
							typeInfo,
						};
					}

					return node;
				}

				ts.visitNode(statement, visit);
			}
		}

		if (Object.keys(definitions).length) {
			const results = generateDefinitions(definitions);
			for (let result of results) {
				if (!result.canWrite) continue;
				PluginConfig.generatedDir.write(result.type + ".d.ts", result.source);
			}
		}
	}

	public writeFiles(): void {

	}
}

export const PluginContext = new PluginContextInstance();
