import express from 'express';
import { getConfigList, getGovernanceData, getDeliveryData, exportConfigData } from '../controllers/configController';

const router = express.Router();

router.get('/list', getConfigList);
router.get('/governance', getGovernanceData);
router.get('/delivery', getDeliveryData);
router.get('/export', exportConfigData);

export default router; 