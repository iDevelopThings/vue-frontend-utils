import { defineConfig }     from 'vite';
import vue                  from "@vitejs/plugin-vue";
import { VueFrontendUtils } from './src/VitePlugin/Plugin';


export default defineConfig({
	plugins : [
		VueFrontendUtils({
			srcPathFromRoot : 'src',
			tsConfigPathFromRoot : 'tsconfig.dev.json'
		}),
		vue()
	],
	build   : {
		outDir      : 'dist',
		sourcemap   : true,
		emptyOutDir : false,
	},
});
