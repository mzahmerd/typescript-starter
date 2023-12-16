// import Transaction, { TransactionInput, TransactionInputUpdate, TransactionOutput } from '../models/Transaction';
import Transaction, {
    TransactionInput,
    TransactionOutput,
    TransactionInputUpdate
} from '../models/Transaction';
import User from '../models/User';

interface ITransactionRepository {
    createTransaction(payload: TransactionInput): Promise<TransactionOutput>;
    getTransactions(): Promise<TransactionOutput[]>;
    getTransactionsByKey(
        key: string,
        val: string
    ): Promise<TransactionOutput[]>;
    getTransactionDetail(
        transactionId: number
    ): Promise<TransactionOutput | null>;
    getTransactionByRef(reference: string): Promise<TransactionOutput | null>;
    updateTransaction(
        transactionId: number,
        payload: TransactionInputUpdate
    ): Promise<boolean>;
    deleteTransaction(transactionId: number): Promise<boolean>;
}

class TransactionRepository implements ITransactionRepository {
    createTransaction(payload: TransactionInput): Promise<TransactionOutput> {
        return Transaction.create(payload);
    }

    getTransactions(): Promise<TransactionOutput[]> {
        return Transaction.findAll({
            attributes: [
                'id',
                'userId',
                'amount',
                'charge',
                'netAmount',
                'description',
                'reference',
                'transactionType',
                'sessionId',
                'status',
                'details',
                'type',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ]
        });
    }

    getTransactionsByKey(
        key: string,
        val: string
    ): Promise<TransactionOutput[]> {
        return Transaction.findAll({
            where: { [key]: val },
            attributes: [
                'id',
                'userId',
                'amount',
                'charge',
                'netAmount',
                'description',
                'reference',
                'transactionType',
                'sessionId',
                'status',
                'details',
                'type',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ]
        });
    }

    getTransactionDetail(
        transactionId: number
    ): Promise<TransactionOutput | null> {
        return Transaction.findByPk(transactionId, {
            attributes: [
                'id',
                'userId',
                'amount',
                'charge',
                'netAmount',
                'description',
                'reference',
                'transactionType',
                'sessionId',
                'status',
                'details',
                'type',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ],
            include: [
                {
                    model: User,
                    as: 'user',
                    required: false
                }
            ]
        });
    }

    getTransactionByRef(reference: string): Promise<TransactionOutput | null> {
        return Transaction.findOne({
            where: {
                reference: reference
            }
        });
    }

    async updateTransaction(
        transactionId: number,
        payload: TransactionInputUpdate
    ): Promise<boolean> {
        const [updatedTransactionCount] = await Transaction.update(payload, {
            where: {
                id: transactionId
            }
        });
        return !!updatedTransactionCount;
    }

    async deleteTransaction(transactionId: number): Promise<boolean> {
        const deletedTransactionCount = await Transaction.destroy({
            where: {
                id: transactionId
            }
        });
        return !!deletedTransactionCount;
    }
}

export default new TransactionRepository();
