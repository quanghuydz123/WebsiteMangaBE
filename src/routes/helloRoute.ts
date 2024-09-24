import { Router } from 'express';

const router = Router();

// Define a GET route at the root of /hello
router.get('/', (req, res) => {
    res.send('Hello World!');
});

export default router;
