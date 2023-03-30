import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.post('/', (req, res) => {
  console.log(1)
})

export default router;
