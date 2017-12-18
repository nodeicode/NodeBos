
const express = require('express');
const router = express.Router();
const storeControllers = require('../controllers/storeControllers');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeControllers.getStores));
router.get('/stores',catchErrors( storeControllers.getStores));
router.get('/add',storeControllers.addstore)

router.post('/add',
   storeControllers.upload,
   catchErrors(storeControllers.resize),
   catchErrors(storeControllers.createStore));

router.post('/add/:id',
storeControllers.upload,
catchErrors(storeControllers.resize),
catchErrors(storeControllers.updateStore));

router.get('/stores/:id/edit',catchErrors(storeControllers.editStore));
router.get('/store/:name',catchErrors(storeControllers.showStore));
module.exports = router;
