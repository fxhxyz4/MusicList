import { Router } from 'express';
const router = Router();

router.get('/auth', (req, res) => {
  res.send('123')
})

export default router;
