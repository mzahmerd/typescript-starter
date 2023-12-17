import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../../database/config';
import User, { UserOutput } from './User';

interface TransactionAttributes {
    id: number;
    userId: number;
    user?: UserOutput | null;
    amount: number;
    charge: number;
    channelCommision: number;
    netAmount: number;
    description: string;
    responseMessage: string;
    channel: string;
    channelReference: string;
    reference: string;
    transactionType: string;
    sessionId: string;
    status: 'pending' | 'successful' | 'failed' | 'refunded';
    statusCode: string;
    details: string;
    type: 'debit' | 'credit';
    responseData: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type TransactionInput = Optional<TransactionAttributes, 'id' | 'user'>;
export type TransactionInputUpdate = Optional<
    TransactionAttributes,
    | 'id'
    | 'user'
    | 'amount'
    | 'netAmount'
    | 'charge'
    | 'channel'
    | 'reference'
    | 'details'
>;

export type TransactionOutput = Optional<
    TransactionAttributes,
    'user' | 'responseData'
>;

class Transaction
    extends Model<TransactionAttributes, TransactionInput>
    implements TransactionAttributes
{
    public id!: number;
    public userId!: number;
    public user!: UserOutput | null;
    public amount!: number;
    public charge!: number;
    public channelCommision!: number;
    public netAmount!: number;
    public description!: string;
    public responseMessage!: string;
    public channel!: string;
    public channelReference!: string;
    public reference!: string;
    public transactionType!: string;
    public sessionId!: string;
    public status!: 'pending' | 'successful' | 'failed' | 'refunded';
    public statusCode!: string;
    public details!: string;
    public type!: 'debit' | 'credit';
    public responseData!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        charge: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        channelCommision: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        responseMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        netAmount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        channelReference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transactionType: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        statusCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('debit', 'credit'),
            allowNull: true
        },
        responseData: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'transactions',
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        sequelize: db
    }
);

export default Transaction;
