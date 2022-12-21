import type {Plugin, ViteDevServer} from "vite";
import type {AcornNode as AcornNode2} from "rollup";
import {PluginContext} from "./PluginContext";
import {PluginConfig, type UserPluginConfig} from "./PluginConfig";

export type AcornNode<T = any> = AcornNode2 & Record<string, T>

export function VueFrontendUtils(config: UserPluginConfig): Plugin {
	PluginConfig.setUserConfig(config);

	let server: ViteDevServer;

	/*if (isTestingEnv()) {
		return [
			plugin,
			typescript({
				transformers : {
					before : [
						{
							type    : 'program',
							factory : (program) => TransformerFactory(program),
						},
					],
				},
			})
		] as any;
	}*/

	return {
		name : "vue-frontend-utils",

		configResolved(config) {
			PluginContext.init(config);
		},

		configureServer(devServer) {
			/*server = devServer;
			server.watcher.on("all", (eventName: "add" | "change" | "unlink", filePath: string, stats?: fs.Stats) => {
				if (!["add", "change", "unlink"].includes(eventName)) {
					return;
				}

				if (PluginConfig.isGeneratedFile(filePath)) {
					return;
				}
			});*/
		},

		buildStart(options: any) {
		},
	};
}

export default VueFrontendUtils;
