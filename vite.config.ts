import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			solidPlugin(),
			dts({
				include: ['src/**/*.ts'],
				outputDir: path.resolve(__dirname, 'dist/types'),
			}),
		],
		build: {
			minify: true,
			target: 'esnext',
			lib: {
				entry: path.resolve(__dirname, './src/index.ts'),
				name: 'Solid_request',
				formats: ['es', 'cjs', 'iife'],
				fileName: (format) => {
					return `js/index.${format}.js`
				},
			},
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				external: ['vue'],
				output: {
					globals: {
						vue: 'Vue',
					},
				},
			},
		},
	}
})
