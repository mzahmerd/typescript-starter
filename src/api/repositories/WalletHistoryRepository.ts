// import WalletHistory, { WalletHistoryInput, WalletHistoryInputUpdate, WalletHistoryOutput } from '../models/WalletHistory';
import Wallet from '../models/Wallet';
import WalletHistory, {
    WalletHistoryInput,
    WalletHistoryOutput,
    WalletHistoryInputUpdate
} from '../models/WalletHistory';

interface IWalletHistoryRepository {
    createWalletHistory(
        payload: WalletHistoryInput
    ): Promise<WalletHistoryOutput>;
    getWalletHistorys(): Promise<WalletHistoryOutput[]>;
    getWalletHistoryDetail(
        walletHistoryId: number
    ): Promise<WalletHistoryOutput | null>;
    getWalletHistoryByWallet(
        userId: string
    ): Promise<WalletHistoryOutput | null>;
    updateWalletHistory(
        walletHistoryId: number,
        payload: WalletHistoryInputUpdate
    ): Promise<boolean>;
    deleteWalletHistory(walletHistoryId: number): Promise<boolean>;
}

class WalletHistoryRepository implements IWalletHistoryRepository {
    createWalletHistory(
        payload: WalletHistoryInput
    ): Promise<WalletHistoryOutput> {
        return WalletHistory.create(payload);
    }

    getWalletHistorys(): Promise<WalletHistoryOutput[]> {
        return WalletHistory.findAll();
    }

    getWalletHistoryDetail(
        walletHistoryId: number
    ): Promise<WalletHistoryOutput | null> {
        return WalletHistory.findByPk(walletHistoryId, {
            include: [
                {
                    model: Wallet,
                    as: 'wallet',
                    required: false
                }
            ]
        });
    }

    getWalletHistoryByWallet(
        walletId: string
    ): Promise<WalletHistoryOutput | null> {
        return WalletHistory.findOne({
            where: {
                walletId: walletId
            }
        });
    }

    async updateWalletHistory(
        walletHistoryId: number,
        payload: WalletHistoryInputUpdate
    ): Promise<boolean> {
        const [updatedWalletHistoryCount] = await WalletHistory.update(
            payload,
            {
                where: {
                    id: walletHistoryId
                }
            }
        );
        return !!updatedWalletHistoryCount;
    }

    async deleteWalletHistory(walletHistoryId: number): Promise<boolean> {
        const deletedWalletHistoryCount = await WalletHistory.destroy({
            where: {
                id: walletHistoryId
            }
        });
        return !!deletedWalletHistoryCount;
    }
}

export default new WalletHistoryRepository();
