import { defineConfig } from 'vite';
import dts              from "vite-plugin-dts";
import vue              from "@vitejs/plugin-vue";


export default defineConfig({
	plugins : [
		dts({
			tsConfigFilePath : "./tsconfig.lib.json",
			insertTypesEntry : true,
		}),
		vue()
	],
	build   : {
		outDir        : 'dist',
		sourcemap     : true,
		lib           : {
			name     : 'VueFrontendUtils',
			entry    : './src/VuePlugin/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs', 'umd', 'iife'],
		},
		rollupOptions : {
			external : [
				"@headlessui/vue",
				"vue"
			],
			output   : {
				globals : {},
			},
		},
	},
});
