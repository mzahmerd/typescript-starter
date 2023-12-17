import * as bcrypt from 'bcrypt';
import WalletRepository from '../repositories/WalletRepository';
import { WalletInput, WalletInputUpdate, WalletOutput } from '../models/Wallet';
import WalletHistoryRepository from '../repositories/WalletHistoryRepository';

interface IWalletService {
    createWallet(payload: WalletInput): Promise<WalletOutput>;
    getWallets(): Promise<WalletOutput[]>;
    getWalletDetail(walletId: number): Promise<WalletOutput>;
    getWalletByUser(userId: number): Promise<WalletOutput>;

    updateWallet(walletId: number, data: WalletInputUpdate): Promise<boolean>;
    deleteWallet(walletId: number): Promise<boolean>;
}

class WalletService implements IWalletService {
    async createWallet(payload: WalletInput): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletByUser(
            payload.userId as number
        );

        if (wallet) {
            throw new Error('Wallet already exists, contact admin.');
        }

        return WalletRepository.createWallet(payload);
    }

    getWallets(): Promise<WalletOutput[]> {
        return WalletRepository.getWallets();
    }

    async getWalletDetail(walletId: number): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }
    async getWalletByUser(userId: number): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletByUser(userId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }
    async updateWallet(
        walletId: number,
        payload: WalletInputUpdate
    ): Promise<boolean> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return WalletRepository.updateWallet(walletId, payload);
    }

    async deleteWallet(walletId: number): Promise<boolean> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return WalletRepository.deleteWallet(walletId);
    }

    async initDebitAccount({
        userId,
        amount,
        reference,
        remark,
        transactionType,
        transactionId
    }: any) {
        const userWallet: any = await WalletRepository.getWalletByUser(userId);
        if (!userWallet) {
            return {
                success: false,
                message: `Wallet not found`
            };
        }

        const currentBalance = userWallet.balance;
        // Check if funds is sufficient
        if (currentBalance < amount)
            return {
                success: false,
                message: `Insufficient Funds, Could not debit, available is ${currentBalance}`,
                currentBalance: currentBalance
            };

        const newBalance = currentBalance - amount;
        // if true then update debited
        const updateData = {
            prevBalance: currentBalance,
            prevLockedBalance: userWallet.lockedBalnce,
            balance: newBalance,
            lockedBalance: userWallet.lockedBalance + amount
        };
        const updateWallet = await WalletRepository.updateWallet(
            userWallet?.id,
            updateData
        );

        if (!updateWallet)
            return { success: false, message: 'Failed to Debit wallet' };

        //   Keep Record
        await WalletHistoryRepository.createWalletHistory({
            walletId: userWallet.id,
            reference: reference,
            amount: amount,
            currentBalance: updateData.balance,
            prevBalance: currentBalance,
            currentLockedBalance: updateData.lockedBalance,
            prevLockedBalance: userWallet.lockedBalance,
            currentLedgerBalance: userWallet.ledgerBalance,
            prevLedgerBalance: userWallet.ledgerBalance,
            balanceType: 'available',
            remark,
            transactionType,
            transactionId,
            action: 'debit'
        });

        return {
            success: true,
            message: 'Wallet Debited',
            data: {
                previousBalance: currentBalance,
                newBalance: newBalance
            }
        };
    }

    async confirmDebitAccount({
        userId,
        amount,
        reference,
        remark,
        transactionTypeName,
        id
    }: any) {
        const userWallet = await WalletRepository.getWalletByUser(userId);
        if (!userWallet) {
            return { sucess: false, message: 'Wallet found' };
        }

        const updateData = {
            prevLedgerBalance: userWallet.ledgerBalance,
            prevLockedBalance: userWallet.lockedBalance,
            ledgerBalance: (userWallet.ledgerBalance as number) - amount,
            lockedBalance: (userWallet.lockedBalance as number) - amount
        };

        const updateWallet = await WalletRepository.updateWallet(
            userWallet?.id,
            {
                prevLedgerBalance: userWallet.ledgerBalance,
                prevLockedBalance: userWallet.lockedBalance,
                ledgerBalance: (userWallet.ledgerBalance as number) - amount,
                lockedBalance: (userWallet.lockedBalance as number) - amount
            }
        );

        if (!updateWallet)
            return {
                success: false,
                message: 'Failed to confirm wallet debit'
            };

        //   Keep Record
        await WalletHistoryRepository.createWalletHistory({
            walletId: userWallet.id,
            reference: reference,
            amount,
            currentBalance: userWallet.balance as number,
            prevBalance: userWallet.balance as number,
            currentLockedBalance: updateData.lockedBalance,
            prevLockedBalance: userWallet.lockedBalance as number,
            currentLedgerBalance: updateData.ledgerBalance,
            prevLedgerBalance: userWallet.ledgerBalance as number,
            balanceType: 'locked',
            remark,
            transactionType: transactionTypeName,
            transactionId: id,
            action: 'debit'
        });

        return {
            success: true,
            message: 'Wallet Debit confirmed'
        };
    }

    //   initCreditAccount: async ({
    //     userId,
    //     amount,
    //     reference,
    //     remark,
    //     transactionType,
    //     transactionId,
    //     destination,
    //   }: any) => {
    //     const userWallet = await WalletRepository.getWalletByUser(destination);
    //     if (!userWallet)
    //       return { success: false, message: "Failed to fetch wallet" };

    //     const updateData = {
    //       prevLedgerBalance: userWallet.ledgerBalance,
    //       prevLockedBalance: userWallet.lockedBalance,
    //       ledgerBalance: userWallet.ledgerBalance + amount,
    //       lockedBalance: userWallet.lockedBalance + amount,
    //     };

    //     const updateWallet = await WalletRepository.updateWallet(userWallet?.id, {
    //       prevLedgerBalance: userWallet.ledgerBalance,
    //       prevLockedBalance: userWallet.lockedBalance,
    //       ledgerBalance: userWallet.ledgerBalance + amount,
    //       lockedBalance: userWallet.lockedBalance + amount,
    //     });

    //     if (!updateWallet)
    //       return { success: false, message: "Failed to initiate wallet credit" };

    //     //   Keep Record
    //     await WalletHistoryRepository.create({
    //       walletId: userWallet.id,
    //       reference: reference,
    //       amount,
    //       currentBalance: userWallet.balance,
    //       prevBalance: userWallet.balance,
    //       currentLockedBalance: updateData.lockedBalance,
    //       prevLockedBalance: userWallet.lockedBalance,
    //       currentLedgerBalance: updateData.ledgerBalance,
    //       prevLedgerBalance: userWallet.ledgerBalance,
    //       balanceType: "locked",
    //       transactionId: transactionId,
    //       remark,
    //       transactionType,
    //       action: "credit",
    //     });

    //     return {
    //       success: true,
    //       message: "Wallet credit initiated",
    //     };
    //   },

    //   confirmCreditAccount: async ({
    //     userId,
    //     amount,
    //     reference,
    //     remark,
    //     transactionType,
    //     transactionId,
    //   }: any) => {
    //     const userWallet = await WalletRepository.getWalletByUser(userId);
    //     if (!userWallet)
    //       return { success: false, message: "Failed to fetch user wallet" };
    //     const updateData = {
    //       prevBalance: userWallet.balance,
    //       prevLockedBalance: userWallet.lockedBalance,
    //       balance: userWallet.balance + amount,
    //       lockedBalance: userWallet.lockedBalance - amount,
    //     };

    //     const updateWallet = await WalletRepository.updateWallet(
    //       userWallet?.id as number,
    //       updateData
    //     );

    //     if (!updateWallet)
    //       return { success: false, message: "Failed to confirm wallet credit" };

    //     //   Keep Record
    //     await WalletHistoryRepository.create({
    //       walletId: userWallet.id,
    //       reference: reference,
    //       amount,
    //       currentBalance: updateData.balance,
    //       currentLockedBalance: updateData.lockedBalance,
    //       currentLedgerBalance: userWallet.ledgerBalance,
    //       prevBalance: userWallet.balance,
    //       prevLockedBalance: userWallet.lockedBalance,
    //       prevLedgerBalance: userWallet.ledgerBalance,
    //       balanceType: "available",
    //       remark,
    //       transactionType,
    //       action: "refund",
    //       transactionId: transactionId,
    //     });

    //     return {
    //       success: true,
    //       message: "Wallet credit confirmed",
    //     };
    //   },

    async fundWallet({
        userId,
        amount,
        reference,
        remark,
        transactionType,
        transactionId
    }: any) {
        const wallet = await WalletRepository.getWalletByUser(userId);

        if (!wallet) return { success: false, message: 'Wallet not found' };

        const newBalance = wallet.balance + amount;
        const newLedger = wallet.ledgerBalance + amount;
        const updateData = {
            prevBalance: wallet.balance,
            prevLedgerBalance: wallet.ledgerBalance,
            balance: newBalance,
            ledgerBalance: newLedger
        };

        const updateWallet = await WalletRepository.updateWallet(
            wallet?.id,
            updateData
        );
        if (!updateWallet)
            return { success: false, message: 'Failed to fund wallet' };

        //   Keep Record
        await WalletHistoryRepository.createWalletHistory({
            walletId: wallet.id,
            reference: reference,
            amount,
            prevBalance: updateData.prevBalance as number,
            currentBalance: updateData.balance,
            prevLedgerBalance: updateData.prevLedgerBalance as number,
            currentLedgerBalance: updateData.ledgerBalance,
            prevLockedBalance: wallet.lockedBalance as number,
            currentLockedBalance: wallet.lockedBalance as number,
            balanceType: 'available',
            remark,
            transactionId: transactionId,
            transactionType,
            action: 'credit'
        });

        return {
            success: true,
            message: 'Wallet funded'
        };
    }

    //   directDebitWallet: async ({
    //     walletId,
    //     amount,
    //     reference,
    //     remark,
    //     transactionType,
    //     transactionId,
    //   }: any) => {
    //     const wallet = await WalletRepository.getWalletById(walletId);
    //     if (!wallet) return null;

    //     const updateData = {
    //       prevBalance: wallet.balance,
    //       prevLedgerBalance: wallet.ledgerBalance,
    //       balance: wallet.balance - amount,
    //       ledgerBalance: wallet.ledgerBalance - amount,
    //     };

    //     const updateWallet = await WalletRepository.updateWallet(
    //       wallet?.id as number,
    //       updateData
    //     );
    //     if (!updateWallet)
    //       return { success: false, message: "Failed wallet debit" };

    //     //   Keep Record
    //     await WalletHistoryRepository.create({
    //       walletId: wallet.id,
    //       reference: reference,
    //       amount,
    //       prevBalance: updateData.prevBalance,
    //       currentBalance: updateData.balance,
    //       prevLedgerBalance: updateData.prevLedgerBalance,
    //       currentLedgerBalance: updateData.ledgerBalance,
    //       prevLockedBalance: wallet.lockedBalance,
    //       currentLockedBalance: wallet.lockedBalance,
    //       balanceType: "available",
    //       remark,
    //       transactionId: transactionId,
    //       transactionType,
    //       action: "debit",
    //     });

    //     return {
    //       success: true,
    //       message: "Wallet debited",
    //     };
    //   },
}

export default new WalletService();
