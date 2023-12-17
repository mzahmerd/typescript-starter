import { NextFunction, Request, Response } from 'express';
import RoleService from '../services/RoleService';
import { CreateRoleType } from '../types/role';
import { asyncHandler } from '../middlewares/handlers/async';
import vTPass from '../libraries/vtPass';
import { STATUS } from '../../constants';
import { camelize, randomRef, vtPassDateRef } from '../../utils/helpers';
import TransactionService from '../services/TransactionService';
import WalletService from '../services/WalletService';

class UtilityController {
    telecoms = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            const telecoms = await vTPass.allTelecoms();
            res.status(STATUS.OK).json({
                success: telecoms.success,
                data: telecoms.data
            });
        }
    );
    buyAirtime = asyncHandler(
        async (
            req: Request | any,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            const { pin, service, phone, favourite } = req.body;
            const amount = parseFloat(req.body.amount);

            const { userdata } = req;
            const reference = randomRef(6);

            const fees = 0;
            const netAmount = amount + fees;

            //  create transaction record with status pending
            const transaction = await TransactionService.createTransaction({
                userId: userdata.id,
                amount: amount,
                reference,
                netAmount: netAmount,
                type: 'debit',
                charge: fees,
                status: 'pending',
                description: `${service} - ${amount} - ${phone}`,
                transactionType: 'utility',
                details: {},
                channel: 'vtPass'
            });

            if (!transaction) {
                throw new Error('Transaction not created');
            }

            // debit wallet
            const deductWallet = await WalletService.initDebitAccount({
                userId: userdata?.id,
                reference,
                amount: netAmount,
                description: `${service} - ${amount} - ${phone}`,
                transactionType: 'utility',
                transactionId: transaction.id,
                balanceType: 'available'
            });

            if (!deductWallet.success) {
                // update transaction status with failed.
                transaction.status = 'failed';
                // transaction.save();

                throw new Error(deductWallet.message);
            }

            let buy: any = await vTPass.buyAirtime({
                request_id: vtPassDateRef() + '_' + reference,
                amount: amount,
                phone: phone,
                serviceID: service
            });

            // let buy: any = JSON.parse(
            //   '{"success":true,"message":"TRANSACTION SUCCESSFUL","data":{"code":"000","content":{"transactions":{"status":"delivered","productName":"MTN Airtime VTU","uniqueElement":"08035878169","unit_price":10,"quantity":1,"service_verification":null,"channel":"api","commission":0.3,"total_amount":9.7,"discount":null,"type":"Airtime Recharge","email":"admin@bkcash.net","phone":"08139990000","name":null,"convinience_fee":0,"amount":10,"platform":"api","method":"api","transactionId":"16960112311940254040908510"}},"response_description":"TRANSACTION SUCCESSFUL","requestId":"BBMp3g0p9LgpMy","amount":"10.00","transaction_date":{"date":"2023-09-29 19:13:51.000000","timezone_type":3,"timezone":"Africa/Lagos"},"purchased_code":""}}'
            // );

            if (!buy.success) {
                // Update transaction record with failed status
                transaction.status = 'failed';
                // transaction.save();
                //TODO refund wallet

                throw new Error(buy?.message);
            }

            buy = camelize(buy);
            const resultData = buy.data.content.transactions;

            // await UtilityService.create({
            //     ...resultData,
            //     trxId: resultData.transactionId,
            //     transactionId: transaction.data?.id
            // });

            // Update transaction record with success status
            const status = 'successful';
            const details = { service, ...resultData };

            transaction.status = status;
            transaction.details = details;

            // transaction.save();

            const beneficiary = {};

            // try {
            //     beneficiary = await UtilityService.addBeneficiary(
            //         user.id as number,
            //         {
            //             phone: phone,
            //             service: service,
            //             utilityType: 'airtime',
            //             favourite
            //         }
            //     );
            // } catch (error) {
            //     console.log(error);
            // }

            res.status(STATUS.OK).json({
                success: true,
                message: 'Airtime purchased successfully.',
                data: {
                    transaction,
                    beneficiary: beneficiary
                }
            });
        }
    );
    dataBundles = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    buyData = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    electricityList = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    meterLookup = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    buyElectricity = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    tvList = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    tvSubscribtions = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    decoderLookup = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    buyTv = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    educationList = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    educationLookup = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    jambVerify = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    educationPay = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
    getBeneficiaries = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            throw new Error('not implemented');
        }
    );
}

export default new UtilityController();
