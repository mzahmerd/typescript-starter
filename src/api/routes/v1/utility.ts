import { Router } from 'express';
import Auth from '../../middlewares/auth';
import { Validate, Requirements } from '../../middlewares/validator';
import { ROLE } from '../../../constants';
import UtilityController from '../../controllers/UtilityController';

const utilityRouter: Router = Router();

utilityRouter.use(Auth.authenticate);

utilityRouter.use(Auth.checkRoles(ROLE.ADMIN, ROLE.AGENT, ROLE.USER));

utilityRouter.get('/telecoms-list', UtilityController.telecoms);
utilityRouter.post('/buy-airtime', UtilityController.buyAirtime);
utilityRouter.get('/data-bundles', UtilityController.dataBundles);
utilityRouter.post('/buy-data', UtilityController.buyData);
utilityRouter.get('/electricity-list', UtilityController.electricityList);
utilityRouter.post('/meter-info', UtilityController.meterLookup);
utilityRouter.post('/buy-electricity', UtilityController.buyElectricity);

utilityRouter.get('/tv-list', UtilityController.tvList);
utilityRouter.get('/tv-subscribtions', UtilityController.tvSubscribtions);

utilityRouter.post('/decoder-info', UtilityController.decoderLookup);
utilityRouter.post('/buy-tv-subsribtion', UtilityController.buyTv);
utilityRouter.get('/education-list', UtilityController.educationList);
utilityRouter.post('/verify-jamb', UtilityController.jambVerify);
utilityRouter.get('/education-info', UtilityController.educationLookup);
utilityRouter.post('/education-pay', UtilityController.educationPay);
utilityRouter.get('/beneficiaries', UtilityController.getBeneficiaries);

export default utilityRouter;
