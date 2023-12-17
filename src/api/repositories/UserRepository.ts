// import User, { UserInput, UserInputUpdate, UserOutput } from '../models/User';
import { Op } from 'sequelize';
import Role from '../models/Role';
import User, { UserInput, UserOutput, UserInputUpdate } from '../models/User';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

interface IUserRepository {
    createUser(payload: UserInput): Promise<UserOutput>;
    getUsers(): Promise<UserOutput[]>;
    getUserDetail(userId: number): Promise<UserOutput | null>;
    getUserByUsername(username: string): Promise<UserOutput | null>;
    getUserByKey(
        key: string,
        value: string | number
    ): Promise<UserOutput | null>;

    updateUser(userId: number, payload: UserInputUpdate): Promise<boolean>;
    deleteUser(userId: number): Promise<boolean>;
}

class UserRepository implements IUserRepository {
    getUserByKey(
        key: string,
        value: number | string
    ): Promise<UserOutput | null> {
        return User.findOne({ where: { [key]: value } });
    }

    createUser(payload: UserInput): Promise<UserOutput> {
        return User.create(payload);
    }

    getUsers(): Promise<UserOutput[]> {
        return User.findAll({
            attributes: [
                'id',
                'roleId',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
                'username'
            ]
        });
    }

    getUserDetail(userId: number): Promise<UserOutput | null> {
        return User.findByPk(userId, {
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
                'username'
            ],
            include: [
                {
                    model: Role,
                    as: 'role',
                    required: false
                },
                {
                    model: Wallet,
                    as: 'wallet',
                    required: false
                },
                {
                    model: Transaction,
                    as: 'transactions',
                    required: false
                }
            ]
        });
    }

    getUserByUsername(username: string): Promise<UserOutput | null> {
        return User.findOne({
            where: {
                [Op.or]: [{ email: username }, { phoneNumber: username }]
            }
        });
    }

    async updateUser(
        userId: number,
        payload: UserInputUpdate
    ): Promise<boolean> {
        const [updatedUserCount] = await User.update(payload, {
            where: {
                id: userId
            }
        });
        return !!updatedUserCount;
    }

    async deleteUser(userId: number): Promise<boolean> {
        const deletedUserCount = await User.destroy({
            where: {
                id: userId
            }
        });
        return !!deletedUserCount;
    }
}

export default new UserRepository();
