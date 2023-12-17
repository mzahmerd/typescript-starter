import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize';
import { db } from '../../database/config';

class Beneficiary extends Model<
    InferAttributes<Beneficiary>,
    InferCreationAttributes<Beneficiary>
> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare beneficiaryId: number;
    declare accountNumber: string;
    declare accountName: string;
    declare favourite: boolean;
    declare createdAt?: Date;
    declare updatedAt?: Date;
    declare deletedAt?: Date;
}

Beneficiary.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        beneficiaryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        favourite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: true,
        sequelize: db,
        tableName: 'beneficiaries',
        freezeTableName: true
    }
);

export default Beneficiary;
