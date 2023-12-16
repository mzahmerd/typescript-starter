import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    Optional
} from 'sequelize';
import { db } from 'src/database/config';
import { WalletOutput } from './Wallet';
interface WalletHistoryAttributes {
    id: number;
    walletId: number;
    wallet?: WalletOutput | null;
    reference: string;
    amount: number;
    currentBalance: number;
    currentLockedBalance: number;
    currentLedgerBalance: number;
    prevBalance: number;
    prevLockedBalance: number;
    prevLedgerBalance: number;
    balanceType: string;
    remark: string;
    transactionType: string;
    transactionId: number;
    action: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type WalletHistoryInput = Optional<
    WalletHistoryAttributes,
    'id' | 'wallet'
>;
export type WalletHistoryInputUpdate = Optional<
    WalletHistoryAttributes,
    'id' | 'wallet'
>;

export type WalletHistoryOutput = Optional<WalletHistoryAttributes, 'wallet'>;

class WalletHistory
    extends Model<WalletHistoryAttributes, WalletHistoryInput>
    implements WalletHistoryAttributes
{
    public id!: number;
    public walletId!: number;
    public wallet!: WalletOutput | null;
    public reference!: string;
    public amount!: number;
    public currentBalance!: number;
    public currentLockedBalance!: number;
    public currentLedgerBalance!: number;
    public prevBalance!: number;
    public prevLockedBalance!: number;
    public prevLedgerBalance!: number;
    public balanceType!: string;
    public remark!: string;
    public transactionType!: string;
    public transactionId!: number;
    public action!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

WalletHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        walletId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        currentBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        currentLockedBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        currentLedgerBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        prevBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        prevLockedBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        prevLedgerBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        balanceType: {
            type: DataTypes.ENUM('available', 'ledger'),
            allowNull: false
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transactionType: {
            type: DataTypes.STRING, //ENUM("utility","wallet_transfer","bank_transfer", "fund_wallet"),
            allowNull: false
        },
        transactionId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        action: {
            type: DataTypes.ENUM('credit', 'debit', 'refund'),
            allowNull: false
        }
    },
    {
        tableName: 'walletHistories',
        timestamps: true,
        sequelize: db,
        paranoid: true,
        freezeTableName: true
    }
);

export default WalletHistory;
