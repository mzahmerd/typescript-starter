import * as bcrypt from 'bcrypt';
import WalletRepository from '../repositories/WalletRepository';
import { WalletInput, WalletInputUpdate, WalletOutput } from '../models/Wallet';

interface IWalletService {
    createWallet(payload: WalletInput): Promise<WalletOutput>;
    getWallets(): Promise<WalletOutput[]>;
    getWalletDetail(walletId: number): Promise<WalletOutput>;
    getWalletByUser(userId: number): Promise<WalletOutput>;

    updateWallet(walletId: number, data: WalletInputUpdate): Promise<boolean>;
    deleteWallet(walletId: number): Promise<boolean>;
}

class WalletService implements IWalletService {
    async createWallet(payload: WalletInput): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletByUser(
            payload.userId as number
        );

        if (wallet) {
            throw new Error('Wallet already exists, contact admin.');
        }

        return WalletRepository.createWallet(payload);
    }

    getWallets(): Promise<WalletOutput[]> {
        return WalletRepository.getWallets();
    }

    async getWalletDetail(walletId: number): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }
    async getWalletByUser(userId: number): Promise<WalletOutput> {
        const wallet = await WalletRepository.getWalletByUser(userId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }
    async updateWallet(
        walletId: number,
        payload: WalletInputUpdate
    ): Promise<boolean> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return WalletRepository.updateWallet(walletId, payload);
    }

    async deleteWallet(walletId: number): Promise<boolean> {
        const wallet = await WalletRepository.getWalletDetail(walletId);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return WalletRepository.deleteWallet(walletId);
    }
}

export default new WalletService();
