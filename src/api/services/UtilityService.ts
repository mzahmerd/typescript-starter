// export default class UtilityService {
//     public static async create(data: any) {
//         // const admin = new Admin(data);
//         // return await admin.save().then((adm) => adm);
//         return await Utility.create(data);
//     }

//     // FInd Utility by Id
//     public static async find(id: string) {
//         return await Utility.findOne({ where: { id: id } });
//     }
//     // FInd Utility by Id
//     public static async findByReference(ref: string) {
//         return await Utility.findOne({
//             where: { reference: ref }
//         });
//     }
//     // FInd Utility by Id
//     public static async findByUser(user: string) {
//         return await Utility.findMany({
//             where: { userId: user }
//         });
//     }
//     public static async update(id: string, data: any) {
//         return await Utility.update(data, { where: { id: id } });
//     }

//     public static async addBeneficiary(userId: number, data: any) {
//         let whereKeys: any;

//         switch (data.utilityType) {
//             case 'airtime':
//                 whereKeys = {
//                     userId,
//                     phone: data.phone,
//                     service: data.service,
//                     utilityType: data.utilityType
//                 };
//                 break;
//             case 'data':
//                 whereKeys = {
//                     userId,
//                     phone: data.phone,
//                     service: data.service,
//                     utilityType: data.utilityType
//                 };
//                 break;
//             case 'tv':
//                 whereKeys = {
//                     userId,
//                     cardNumber: data.cardNumber,
//                     service: data.service
//                 };
//                 break;
//             case 'electricity':
//                 whereKeys = { userId, meterNo: data.meterNo, code: data.code };
//                 break;
//             case 'education':
//                 whereKeys = {
//                     userId,
//                     service: data.service,
//                     phone: data.phone
//                 };
//                 break;
//             default:
//                 whereKeys = { userId };
//                 break;
//         }
//         const [beneficiary, created] = await Beneficiary.findOrCreate({
//             where: whereKeys,
//             defaults: data
//         });

//         if (!created && !beneficiary.favourite) {
//             beneficiary.favourite = true;
//             await beneficiary.save();
//         }
//         return beneficiary;
//     }

//     public static async getBeneficiaries(
//         userId: number,
//         utilityType: string,
//         favourite: boolean
//     ) {
//         return favourite
//             ? await Beneficiary.findAll({
//                   where: { userId, utilityType, favourite }
//               })
//             : await Beneficiary.findAll({
//                   where: { userId, utilityType }
//               });
//     }
// }
