import {DefinitionInfo} from "../PluginContext";
import ts from "typescript";
import {TS} from "../TS";
import {toSimpleType, typeToString, SimpleType} from "@jitl/ts-simple-type";
import {PluginConfig} from "../PluginConfig";
import {RegisteredEvent} from "../../VuePlugin/Systems/EventBus";

type GenerateResult = {
	source?: string;
	canWrite: boolean;
	type: "modal" | "event";
}

export function stripQuotes(text: string): string {
	return text.replace(/"/g, "")
		.replace(/'/g, "");
}

export function generateDefinitions(definitions: { [key: string]: DefinitionInfo }): GenerateResult[] {

	const modalDefinitions    = Object.values(definitions).filter(x => x.type === "modal");
	const modalDefSimpleTypes = modalDefinitions.map(x => {
		return toSimpleType(x.typeInfo.typeRef ?? x.typeInfo.type, TS.program.getTypeChecker());
	});

	const eventDefinitions    = Object.values(definitions).filter(x => x.type === "event" && (x.typeInfo?.type || x.typeInfo?.typeRef));
	const eventDefSimpleTypes = eventDefinitions.map(x => {
		return toSimpleType(x.typeInfo.typeRef ?? x.typeInfo.type, TS.program.getTypeChecker());
	});
	return [
		generateModalDefinitions(modalDefinitions, modalDefSimpleTypes),
		generateEventDefinitions(
			eventDefinitions, eventDefSimpleTypes,

			Object.values(modalDefinitions).filter(x => x.type === "modal").map((def, i) => {
				return [
					`\t\t\t"modal:${stripQuotes(def.name)}:open": ${typeToString(modalDefSimpleTypes[i])},\n`,
					`\t\t\t"modal:${stripQuotes(def.name)}:close": ${typeToString(modalDefSimpleTypes[i])},\n`
				].join("");
			})
		),
	];


}

export function generateModalDefinitions(definitions: DefinitionInfo[], modalDefSimpleTypes: SimpleType[]): GenerateResult {
	if (!definitions.length) {
		return {
			canWrite : false,
			type     : "modal",
		};
	}

	const defProperties = definitions.map((def, i) => {
		return `\t\t\t${def.name}: ${typeToString(modalDefSimpleTypes[i])},\n`;
	}).join("");

	const defVars = definitions.map((def, i) => {
		return `\t\t\t${def.varName}: ModalDefinitions[${def.name}],\n`;
	}).join("");

	const stub = `	
declare module "${PluginConfig.isLocalDev ? "../VuePlugin/Systems/Modals" : "vue-frontend-utils"}" {
	
	interface ModalDefinitions {
${defProperties}
	}

	interface ModalVars {
${defVars}
	}	
}
	
	
export {};`;


	return {
		source   : stub,
		canWrite : true,
		type     : "modal",
	};
}

export function generateEventDefinitions(definitions: DefinitionInfo[], eventDefSimpleTypes: SimpleType[], extra: string[]): GenerateResult {
	if (!definitions.length) {
		return {
			canWrite : false,
			type     : "event",
		};
	}

	const defProperties = definitions.map((def, i) => {
		return `\t\t\t${def.name}: ${typeToString(eventDefSimpleTypes[i])},\n`;
	}).join("");

	const stub = `	
declare module "${PluginConfig.isLocalDev ? "../VuePlugin/Systems/EventBus" : "vue-frontend-utils"}" {
	import {RegisteredEvent} from "${PluginConfig.isLocalDev ? "../VuePlugin/Systems/EventBus" : "vue-frontend-utils"}";

	interface EventMap {
${extra.join("")}
${defProperties}
	}

}

export {};
`;


	return {
		source   : stub,
		canWrite : true,
		type     : "event",
	};
}

export function originalTest(definitions: { [key: string]: DefinitionInfo }) {

	const modalDefinitions = Object.values(definitions).filter(x => x.type === "modal");
	const eventDefinitions = Object.values(definitions).filter(x => x.type === "event");


	const modalDefinitionMembers = modalDefinitions.map(x => {
		return ts.factory.createPropertySignature(
			undefined,
			x.name,
			undefined,
			ts.factory.createTypeReferenceNode(TS.typeChecker.typeToString(x.typeInfo.type), undefined),
		);
	});

	const modalDefinitionsTypeLiteral = ts.factory.createTypeLiteralNode(modalDefinitionMembers);

	const modalDefinitionsType = ts.factory.createTypeAliasDeclaration(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		"ModalDefinitions",
		undefined,
		modalDefinitionsTypeLiteral
	);

	const modalVarsMembers = modalDefinitions.map(x => {
		return ts.factory.createPropertySignature(
			undefined,
			x.name,
			undefined,
			ts.factory.createTypeReferenceNode(`ModalDefinitions["${x.name}"]`, undefined),
		);
	});

	const modalVarsTypeLiteral = ts.factory.createTypeLiteralNode(modalVarsMembers);

	const modalVarsType = ts.factory.createTypeAliasDeclaration(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		"ModalVars",
		undefined,
		modalVarsTypeLiteral
	);

	const imports: ts.ImportDeclaration[] = [];

	const referenceTypes = Object.values(definitions)
		.filter(x => x.typeInfo?.typeRef)
		.map(x => x.typeInfo.typeRef);

	for (const referenceType of referenceTypes) {

		const importPath = referenceType.getSourceFile().fileName;
		const importName = referenceType.getText();

		const importDeclaration = ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				false,
				undefined,
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(
						true,
						ts.factory.createIdentifier(importName),
						ts.factory.createIdentifier(importName)
					),
				]),
			),
			ts.factory.createStringLiteral(importPath),
		);

		imports.push(importDeclaration);

	}


	const statements = [
		imports,
		modalDefinitionsType,
		modalVarsType,
	];

	const sourceFile = ts.factory.createSourceFile(
		statements.flat(1),
		ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
		ts.NodeFlags.None
	);


	return sourceFile;
}
