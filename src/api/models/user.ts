import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../../database/config';
import Role, { RoleOutput } from './Role';
import Wallet, { WalletOutput } from './Wallet';
import Transaction from './Transaction';

interface UserAttributes {
    id: number;
    roleId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phoneNumber: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    role?: RoleOutput | null;
    wallet?: WalletOutput | null;
}

export type UserInput = Optional<UserAttributes, 'id' | 'role'>;

export type UserInputUpdate = Optional<
    UserAttributes,
    | 'id'
    | 'email'
    | 'password'
    | 'phoneNumber'
    | 'firstName'
    | 'lastName'
    | 'username'
>;

export type UserOutput = Optional<UserAttributes, 'role'>;

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public roleId!: number;
    public firstName!: string;
    public lastName!: string;
    public username!: string;

    public email!: string;
    public phoneNumber!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: DataTypes.INTEGER
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        sequelize: db
    }
);

User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
});

User.hasOne(Wallet, {
    foreignKey: 'userId',
    as: 'wallet'
});

// Wallet.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'user'
// });

User.hasMany(Transaction, {
    foreignKey: 'userId',
    as: 'transactions'
});

User.sync();

export default User;
