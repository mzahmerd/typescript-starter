// import Wallet, { WalletInput, WalletInputUpdate, WalletOutput } from '../models/Wallet';
import Wallet, {
    WalletInput,
    WalletOutput,
    WalletInputUpdate
} from '../models/Wallet';
import User from '../models/User';

interface IWalletRepository {
    createWallet(payload: WalletInput): Promise<WalletOutput>;
    getWallets(): Promise<WalletOutput[]>;
    getWalletDetail(walletId: number): Promise<WalletOutput | null>;
    getWalletByUser(userId: number): Promise<WalletOutput | null>;
    updateWallet(
        walletId: number,
        payload: WalletInputUpdate
    ): Promise<boolean>;
    deleteWallet(walletId: number): Promise<boolean>;
}

class WalletRepository implements IWalletRepository {
    createWallet(payload: WalletInput): Promise<WalletOutput> {
        return Wallet.create(payload);
    }

    getWallets(): Promise<WalletOutput[]> {
        return Wallet.findAll();
    }

    getWalletDetail(walletId: number): Promise<WalletOutput | null> {
        return Wallet.findByPk(walletId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    required: false
                }
            ]
        });
    }

    getWalletByUser(userId: number): Promise<WalletOutput | null> {
        return Wallet.findOne({
            where: {
                userId: userId
            }
        });
    }

    async updateWallet(
        walletId: number,
        payload: WalletInputUpdate
    ): Promise<boolean> {
        const [updatedWalletCount] = await Wallet.update(payload, {
            where: {
                id: walletId
            }
        });
        return !!updatedWalletCount;
    }

    async deleteWallet(walletId: number): Promise<boolean> {
        const deletedWalletCount = await Wallet.destroy({
            where: {
                id: walletId
            }
        });
        return !!deletedWalletCount;
    }
}

export default new WalletRepository();
