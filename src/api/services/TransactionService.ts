import * as bcrypt from 'bcrypt';
import TransactionRepository from '../repositories/TransactionRepository';
import {
    TransactionInput,
    TransactionInputUpdate,
    TransactionOutput
} from '../models/Transaction';

interface ITransactionService {
    createTransaction(payload: TransactionInput): Promise<TransactionOutput>;
    getTransactions(): Promise<TransactionOutput[]>;
    getTransactionDetail(transactionId: number): Promise<TransactionOutput>;
    getUserTransactions(userId: number): Promise<TransactionOutput[]>;

    updateTransaction(
        transactionId: number,
        data: TransactionInputUpdate
    ): Promise<boolean>;
    deleteTransaction(transactionId: number): Promise<boolean>;
}

class TransactionService implements ITransactionService {
    async createTransaction(
        payload: TransactionInput
    ): Promise<TransactionOutput> {
        return TransactionRepository.createTransaction(payload);
    }

    getTransactions(): Promise<TransactionOutput[]> {
        return TransactionRepository.getTransactions();
    }

    async getTransactionDetail(
        transactionId: number
    ): Promise<TransactionOutput> {
        const transaction = await TransactionRepository.getTransactionDetail(
            transactionId
        );

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return transaction;
    }
    async getUserTransactions(userId: number): Promise<TransactionOutput[]> {
        const transaction = await TransactionRepository.getTransactionsByKey(
            'userId',
            userId as unknown as string
        );

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return transaction;
    }
    async updateTransaction(
        transactionId: number,
        payload: TransactionInputUpdate
    ): Promise<boolean> {
        const transaction = await TransactionRepository.getTransactionDetail(
            transactionId
        );

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return TransactionRepository.updateTransaction(transactionId, payload);
    }

    async deleteTransaction(transactionId: number): Promise<boolean> {
        const transaction = await TransactionRepository.getTransactionDetail(
            transactionId
        );

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return TransactionRepository.deleteTransaction(transactionId);
    }
}

export default new TransactionService();
