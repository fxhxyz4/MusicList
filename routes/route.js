const { Router } = require('express');
const colors = require('colors');
const router = Router();

router.get('/', (res, req) => {
	try {
		res.render('index');
		res.statusCode(200);
	} catch (e) {
		console.log(e);
		res.send(e);
		res.statusCode(500);
	}
});

export default router;
