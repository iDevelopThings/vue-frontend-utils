import { defineConfig } from 'vite';
import dts              from "vite-plugin-dts";


export default defineConfig({
	plugins : [
		dts({
			tsConfigFilePath : "./tsconfig.vite.json",
			insertTypesEntry : true,
		}),
	],
	build   : {
		outDir        : 'dist/vite',
		sourcemap     : true,
		lib           : {
			name     : 'VueFrontendUtilsVite',
			entry    : './src/VitePlugin/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs', 'umd', 'iife'],
		},
		rollupOptions : {
			external : [
				"typescript",
				"fs-jetpack",
				"@jitl/ts-simple-type",
			],
			output   : {
				globals : {},
			},
		},
	},
});
