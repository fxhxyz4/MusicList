module.exports = {
	content: [
    './public/**/*.css',
    './public/scripts/**/**/*.js',
    './views/*.ejs'
],
	theme: {
		extend: {},
	},
	plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
