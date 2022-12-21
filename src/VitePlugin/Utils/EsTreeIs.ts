import {ExpressionMap, BaseNode, VariableDeclaration, VariableDeclarator, CallExpression} from "estree";

export type ExpressionTypes = {
	[K in keyof ExpressionMap as `${Capitalize<K>}`]: (node: BaseNode) => node is ExpressionMap[K]
}
export type IsType = ExpressionTypes & {
	Identifier: (node: BaseNode, name: string) => node is ExpressionMap["Identifier"];
	VariableDeclaration: (node: BaseNode, opts?: { name?: string }) => node is VariableDeclaration;
	VariableDeclarator: (node: BaseNode, opts?: { name?: string }) => node is VariableDeclarator;
	CallExpression: (node: BaseNode, opts?: { name?: string }) => node is CallExpression;
}

export const Is: IsType = {} as any;

const expressionTypesMap = [
	"ArrayExpression",
	"ArrowFunctionExpression",
	"AssignmentExpression",
	"AwaitExpression",
	"BinaryExpression",
	"CallExpression",
	"ChainExpression",
	"ClassExpression",
	"ConditionalExpression",
	"FunctionExpression",
	"Identifier",
	"ImportExpression",
	"Literal",
	"LogicalExpression",
	"MemberExpression",
	"MetaProperty",
	"NewExpression",
	"ObjectExpression",
	"SequenceExpression",
	"TaggedTemplateExpression",
	"TemplateLiteral",
	"ThisExpression",
	"UnaryExpression",
	"UpdateExpression",
	"YieldExpression",
];

for (let expressionTypeName of expressionTypesMap) {
	Is[`${expressionTypeName}`] = (node: any) => {
		return node?.type === expressionTypeName;
	};
}


(Is as any).Identifier = (node, name) => {
	if (node?.type !== "Identifier")
		return false;

	return name === undefined ? true : node.name === name;
};

(Is as any).CallExpression = (node, opts: { name?: string }) => {
	if (node?.type !== "CallExpression")
		return false;

	if(opts?.name) {
		return Is.Identifier(node.callee, opts.name);
	}

	return true;
};

(Is as any).VariableDeclaration = (node, opts: { name?: string }) => {
	if (node?.type !== "VariableDeclaration")
		return false;

	if (opts?.name) {
		const declaration = node.declarations.find((d: any) => d => d.id?.name === opts.name);
		if (!declaration) return false;

		return true;
	}

	return true;
};

(Is as any).VariableDeclarator = (node, opts: { name?: string }) => {
	if (node?.type !== "VariableDeclarator")
		return false;

	if (opts?.name) {
		return node.id?.name === opts.name;
	}

	return true;
};
