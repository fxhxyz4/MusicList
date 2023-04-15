import path from 'path';
import webpack from 'webpack';

const public_path = `./public/scripts/`;
const __dirname = path.dirname(public_path);

export default {
	entry: './public/scripts/main.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve(__dirname, 'out'),
	},
	experiments: {
		topLevelAwait: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.SPOTIFY_ID': JSON.stringify(process.env.SPOTIFY_ID),
			'process.env.SPOTIFY_SECRET': JSON.stringify(process.env.SPOTIFY_SECRET),
		}),
	],
};
