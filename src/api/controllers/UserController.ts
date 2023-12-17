import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import { CreateUserType, UpdateUserType } from '../types/user';
import { STATUS } from '../../constants';
import WalletService from '../services/WalletService';
import { asyncHandler } from '../middlewares/handlers/async';
import TransactionService from '../services/TransactionService';
import { randomRef } from '../../utils/helpers';

class UserController {
    async createUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const payload: CreateUserType = req.body;
            const user = await UserService.createUser(payload);
            res.status(200).send({
                message: 'User created successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    getUsers = asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            try {
                const user = await UserService.getUsers();
                res.status(200).send({
                    message: 'Users fetched successfully',
                    data: user
                });
            } catch (error) {
                next(error);
            }
        }
    );

    async getUserDetail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const user = await UserService.getUserDetail(userId);
            res.status(200).send({
                message: 'User details fetched successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const payload: UpdateUserType = req.body;
            await UserService.updateUser(userId, payload);
            res.status(200).send({
                message: 'User updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = Number(req.params.id);
            await UserService.deleteUser(userId);
            res.status(200).send({
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async currentUser(
        req: Request | any,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = await UserService.getUserById(req.userdata?.id);

            if (!user.wallet) {
                // create user wallet
                const wallet = await WalletService.createWallet({
                    userId: user.id,
                    accountName: user.firstName + ' ' + user.lastName,
                    accountNumber: user.phoneNumber.slice(1),
                    currency: 'NGN',
                    phone: user.phoneNumber,
                    email: user.email,
                    username: user.username
                });

                user.wallet = wallet;
            }

            res.status(STATUS.OK).send({
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async fundUserWallet(
        req: Request | any,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { amount } = req.body;
            const reference = randomRef(6);
            const user = await UserService.getUserById(req.params?.id);

            if (!user.wallet) {
                // user does not have a wallet yet
                throw new Error('user does not have a wallet yet');
            }

            const transaction = await TransactionService.createTransaction({
                amount: amount,
                description: 'Wallet Fund',
                netAmount: amount,
                details: {},
                charge: 0,
                reference,
                transactionType: 'wallet_fund',
                status: 'pending',
                userId: user.id,
                type: 'credit'
            });

            const funded = await WalletService.fundWallet({
                amount,
                reference,
                userId: user.id,
                remark: 'funding wallet from void',
                transactionType: transaction.transactionType,
                transactionId: transaction.id
            });

            if (!funded.success) throw new Error(funded.message);

            res.status(STATUS.OK).send({
                data: transaction,
                message: funded.message
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
