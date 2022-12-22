import { defineConfig } from 'vite';
import vue              from "@vitejs/plugin-vue";

export default defineConfig({
	plugins : [
		vue()
	],
	build   : {
		outDir        : 'dist/lib',
		sourcemap     : true,
		lib           : {
			name     : 'VueFrontendUtils',
			entry    : './src/VuePlugin/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs'],
		},
		rollupOptions : {
			external : [
				"@headlessui/vue",
				"vue"
			],
			output   : {
				globals : {
					"@headlessui/vue" : "HeadlessUIVue",
					"vue"             : "Vue"
				},
			},
		},
		emptyOutDir   : false,
	},
});
