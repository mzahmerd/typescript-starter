import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../../database/config';
import User, { UserOutput } from './User';

interface WalletAttributes {
    id: number;
    userId?: number;
    user?: UserOutput | null;
    currency: string;
    accountNumber: string;
    username?: string;
    accountName: string;
    balance?: number;
    lockedBalance?: number;
    ledgerBalance?: number;
    prevBalance?: number;
    prevLockedBalance?: number;
    prevLedgerBalance?: number;
    phone: string;
    email: string;
    tier?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type WalletInput = Optional<
    WalletAttributes,
    | 'id'
    | 'user'
    | 'tier'
    | 'email'
    | 'balance'
    | 'ledgerBalance'
    | 'prevBalance'
    | 'prevLedgerBalance'
    | 'lockedBalance'
    | 'prevLockedBalance'
    | 'currency'
    | 'username'
>;
export type WalletInputUpdate = Optional<WalletAttributes, 'id' | 'user'>;

export type WalletOutput = Optional<WalletAttributes, 'user'>;

class Wallet
    extends Model<WalletAttributes, WalletInput>
    implements WalletAttributes
{
    public id!: number;
    public userId?: number;
    public user?: UserOutput | null;
    public currency!: string;
    public accountNumber!: string;
    public username?: string;
    public accountName!: string;
    public balance!: number;
    public lockedBalance!: number;
    public ledgerBalance!: number;
    public prevBalance!: number;
    public prevLockedBalance!: number;
    public prevLedgerBalance!: number;
    public phone!: string;
    public email!: string;
    public tier?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Wallet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'NGN'
        },
        accountNumber: {
            type: DataTypes.STRING
            // unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            set(val: string) {
                return this.setDataValue('username', val?.toLowerCase() ?? '');
            }
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lockedBalance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ledgerBalance: {
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tier: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        sequelize: db,
        tableName: 'wallets'
    }
);

export default Wallet;
