import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('*', (req, res) => {
  res.render('404');
})

router.post('/', (req, res) => {
  console.log(1)
})

export default router;
