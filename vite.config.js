import { defineConfig } from 'vite';
import dts              from "vite-plugin-dts";
import vue              from "@vitejs/plugin-vue";


export default defineConfig({
	plugins : [
		dts({
			tsConfigFilePath : "./tsconfig.json",
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
			external : [],
			output   : {
				globals : {},
			},
		},
	},
});
