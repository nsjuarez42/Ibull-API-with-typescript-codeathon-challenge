let express = require('express');
let router = express.Router();
import { Request, Response, NextFunction } from 'express';

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.status(200).send();
});

module.exports = router;
