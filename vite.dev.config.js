import { defineConfig }     from 'vite';
import vue                  from "@vitejs/plugin-vue";
import { VueFrontendUtils } from './src/VitePlugin/Plugin';


export default defineConfig({
	plugins : [
		VueFrontendUtils({
			srcPathFromRoot : 'src',
		}),
		vue()
	],
	build   : {
		outDir        : 'dist',
		sourcemap     : true,
		lib           : {
			name     : 'SurrealSchema',
			entry    : './src/index.ts',
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
