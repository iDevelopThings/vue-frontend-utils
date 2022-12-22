import { defineConfig } from 'vite';

export default defineConfig({
	plugins : [],
	build   : {
		outDir        : 'dist/vite',
		sourcemap     : true,
		lib           : {
			name  : 'VueFrontendUtilsVite',
			entry : './src/VitePlugin/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs'],
		},
		rollupOptions : {
			external : [
				"typescript",
				"fs-jetpack",
				"@jitl/ts-simple-type",
			],
			output   : {
				globals : {
					typescript             : "ts",
					"fs-jetpack"           : "jetpack",
					"@jitl/ts-simple-type" : "tsSimpleType",
				},
			},
		},
		emptyOutDir   : false,
	},
});
