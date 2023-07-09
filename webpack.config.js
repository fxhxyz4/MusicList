import path from 'path';

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
};
