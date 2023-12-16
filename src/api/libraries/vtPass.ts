import axios from 'axios';
import {
    VtpassAirtimeInterface,
    VtpassDataInterface,
    VtpassElectricityInterface,
    VtpassElectricityPayInterface
} from '../types/utility';

import appConfig from '../../config/appConfig';

export default class vTPass {
    public static async serviceInfo(service: any) {
        try {
            const resp = await axios.get(
                `${appConfig.vtPass.url}/service-variations?serviceID=${service}`,
                {
                    headers: {
                        'api-key': `${appConfig.vtPass.apiKey}`,
                        'public-key': `${appConfig.vtPass.publicKey}`
                        //   "Content-Type": "application/json",
                    }
                }
            );
            // console.log(resp);
            const result = resp?.data;
            if (result.response_description != '000')
                return {
                    success: false,
                    message:
                        result?.content?.errors ??
                        'Could not get Info, check your service.',
                    data: {}
                };
            return {
                success: true,
                message: '',
                data: result.content?.variations ?? []
            };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return { success: false, message: '' };
        }
    }

    public static async servicePay(data: any) {
        try {
            const resp = await axios.post(`${appConfig.vtPass.url}/pay`, data, {
                headers: {
                    'api-key': `${appConfig.vtPass.apiKey}`,
                    'secret-key': `${appConfig.vtPass.secretKey}`
                }
            });
            const result = resp?.data;

            if (result.code !== '000')
                return {
                    success: false,
                    message:
                        result?.message ??
                        result?.response_description ??
                        'Faild to purchase Electricity',
                    error: result?.content?.errors,
                    data: {}
                };

            return {
                success: true,
                message:
                    result?.message ??
                    result?.response_description ??
                    'Payment Successfull',
                data: result
            };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return {
                success: false,
                message:
                    e?.response?.data?.message ??
                    e?.response?.data?.message.response_description ??
                    'Could not get info '
            };
        }
    }

    public static async allTelecoms() {
        const telecoms: any = [
            {
                code: 'mtn',
                title: 'MTN'
            },
            {
                code: 'airtel',
                title: 'Airtel'
            },
            {
                code: 'etisalat',
                title: '9 Mobile'
            },
            {
                code: 'glo',
                title: 'GLO'
            },
            {
                code: 'smile',
                title: 'Smile'
            },
            {
                code: 'spectranet',
                title: 'Spectranet'
            }
        ];

        return { success: true, data: telecoms };
    }
    public static async buyAirtime(data: VtpassAirtimeInterface) {
        return await this.servicePay(data);
    }

    public static async dataList(service: string) {
        return await this.serviceInfo(`${service}-data`);
        //     `${Config.vtpassUrl}/service-variations?serviceID=${service}-data`,
    }
    public static async buyData(data: VtpassDataInterface) {
        return await this.servicePay(data);
    }

    public static async allElectricity() {
        const electricity = [
            {
                code: 'ikeja-electric',
                title: 'Ikeja Electricity'
            },
            {
                code: 'eko-electric',
                title: 'Eko Electricity'
            },
            {
                code: 'kano-electric',
                title: 'Kano Electricity'
            },
            {
                code: 'portharcourt-electric',
                title: 'Port Harcout Electricity'
            },
            {
                code: 'jos-electric',
                title: 'Jos Electricity'
            },
            {
                code: 'ibadan-electric',
                title: 'Ibadan Electricity'
            },
            {
                code: 'kaduna-electric',
                title: 'Port Harcout Electricity'
            },
            {
                code: 'abuja-electric',
                title: 'Abuja Electricity'
            },
            {
                code: 'enugu-electric',
                title: 'Enugu Electricity'
            },
            {
                code: 'benin-electric',
                title: 'Benin Electricity'
            }
        ];

        return { success: true, data: electricity };
    }
    public static async meterInfo(data: VtpassElectricityInterface) {
        try {
            const resp = await axios.post(
                `${appConfig.vtPass.url}/merchant-verify`,
                data,
                {
                    headers: {
                        'api-key': `${appConfig.vtPass.apiKey}`,
                        'secret-key': `${appConfig.vtPass.secretKey}`
                    }
                }
            );
            // console.log(resp);
            const result = resp?.data;
            if (result.code != '000')
                return {
                    success: false,
                    message: result?.message,
                    data: {}
                };
            return {
                success: true,
                message: 'Lookup Successfull',
                data: result
            };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return {
                success: false,
                message: e?.response?.data.message ?? 'Could not get info '
            };
        }
    }
    public static async payElectricty(data: VtpassElectricityPayInterface) {
        return await this.servicePay(data);
    }
    public static async requery(reqId: string) {
        try {
            const resp = await axios.post(
                `${appConfig.vtPass.url}/requery`,
                { request_id: reqId },
                {
                    headers: {
                        'api-key': `${appConfig.vtPass.apiKey}`,
                        'secret-key': `${appConfig.vtPass.secretKey}`
                        //   "Content-Type": "application/json",
                    }
                }
            );
            console.log(resp);
            return { success: true, message: '', data: resp?.data };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return { success: false, message: '' };
        }
    }
    // All Tv list
    public static async allTv() {
        const telecoms: any = [
            {
                code: 'dstv',
                title: 'DSTV'
            },
            {
                code: 'gotv',
                title: 'GoTv'
            },
            {
                code: 'startimes',
                title: 'Star Times'
            },
            {
                code: 'showmax',
                title: 'Show Max'
            }
        ];

        return { success: true, data: telecoms };
    }

    public static async tvSubscribtions(service: string) {
        return await this.serviceInfo(service);
        //     `${Config.vtpassUrl}/service-variations?serviceID=${service}`,
    }
    // Decoder Lookup
    public static async decoderInfo(data: any) {
        try {
            const resp = await axios.post(
                `${appConfig.vtPass.url}/merchant-verify`,
                data,
                {
                    headers: {
                        'api-key': `${appConfig.vtPass.apiKey}`,
                        'secret-key': `${appConfig.vtPass.secretKey}`
                    }
                }
            );
            // console.log(resp);
            const result = resp?.data;
            if (result.code != '000')
                return {
                    success: false,
                    message: result?.message,
                    data: {}
                };
            return {
                success: true,
                message: 'Lookup Successfull',
                data: result
            };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return {
                success: false,
                message: e?.response?.data.message ?? 'Could not get info '
            };
        }
    }
    public static async payTv(data: any) {
        return await this.servicePay(data);
    }
    public static async educationList() {
        return {
            success: true,
            data: [
                {
                    code: 'waec-registration',
                    title: 'Waec Registration'
                },
                {
                    code: 'waec',
                    title: 'Waec Result'
                },
                {
                    code: 'jamb',
                    title: 'Jamb'
                }
            ]
        };
    }
    public static async educationLookup(service: string) {
        return await this.serviceInfo(`${service}`);
    }

    public static async jambVerify(data: any) {
        try {
            const resp = await axios.post(
                `${appConfig.vtPass.url}/merchant-verify`,
                data,
                {
                    headers: {
                        'api-key': `${appConfig.vtPass.apiKey}`,
                        'secret-key': `${appConfig.vtPass.secretKey}`
                    }
                }
            );
            // console.log(resp);
            const result = resp?.data;
            if (result.code != '000')
                return {
                    success: false,
                    message: result?.message,
                    data: {}
                };
            return {
                success: true,
                message: 'Verification Successfull',
                data: result
            };
        } catch (e: any) {
            console.log(e?.response?.data ?? 'ERROR ON VTPASS');
            return {
                success: false,
                message: e?.response?.data.message ?? 'Could not get info '
            };
        }
    }
    public static async educationPay(data: any) {
        return await this.servicePay(data);
    }
}
