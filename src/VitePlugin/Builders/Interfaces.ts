import ts from "typescript";

export function generateInterfaceDeclaration(type: ts.Type, name: string): ts.InterfaceDeclaration {
	const properties: ts.PropertySignature[] = [];

	for (const symbol of type.getProperties()) {
		const declaration = symbol.getDeclarations()[0] as ts.PropertySignature;
		properties.push(
			ts.factory.createPropertySignature(
				undefined,
				symbol.getName(),
				declaration.questionToken,
				declaration.type,
			)
		);
	}

	return ts.factory.createInterfaceDeclaration(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		undefined,
		undefined,
		properties
	);
}
