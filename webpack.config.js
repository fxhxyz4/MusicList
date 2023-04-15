import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';

dotenv.config();

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
		new webpack.EnvironmentPlugin({
			'process.env.SPOTIFY_ID': JSON.stringify(process.env.SPOTIFY_ID),
			'process.env.SPOTIFY_SECRET': JSON.stringify(process.env.SPOTIFY_SECRET),
		}),
		new webpack.EnvironmentPlugin(['SPOTIFY_ID', 'SPOTIFY_SECRET']),
	],
};
