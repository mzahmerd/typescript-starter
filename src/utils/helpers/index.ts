import { camelCase, isArray, transform, isObject } from 'lodash';
import moment = require('moment-timezone');

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function camelize(obj: Record<string, unknown>): any {
    return transform(
        obj,
        (
            result: Record<string, unknown>,
            value: unknown,
            key: string,
            target
        ) => {
            const camelKey = isArray(target) ? key : camelCase(key);
            result[camelKey] = isObject(value)
                ? camelize(value as Record<string, unknown>)
                : value;
        }
    );
}

export function randomRef(keyLength = 24): string {
    let i,
        key = '';

    const characters =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const charactersLength = characters.length;

    for (i = 0; i < keyLength; i++) {
        key += characters.substr(
            Math.floor(Math.random() * charactersLength + 1),
            1
        );
    }

    return key + currentTimestamp();
}

// export async function verifyPin(pin: string, hashedPin: string) {
//     return await bcrypt.compare(`${pin}`, hashedPin);
// }
export const currentTimestamp = (): number => {
    return Date.now();
};

export const vtPassDateRef = (): string => {
    return moment.tz('Africa/Lagos').format('YYYYMMDDHHmm');
};
