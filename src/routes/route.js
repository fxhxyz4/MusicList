const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.send('../index.ejs');
	res.sendStatus(200);
});

module.exports = router;
