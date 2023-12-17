import * as dotenv from 'dotenv';
dotenv.config();

import Role from '../api/models/Role';
import User from '../api/models/User';
import Wallet from '../api/models/Wallet';
import WalletHistory from '../api/models/WalletHistory';
import Transaction from '../api/models/Transaction';

const syncTables = () =>
    Promise.all([
        User.sync(),
        Role.sync(),
        Wallet.sync(),
        WalletHistory.sync(),
        Transaction.sync()
    ]);

syncTables()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
    .finally(() => process.exit());
