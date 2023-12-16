import { camelCase, isArray, transform, isObject } from 'lodash';

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function camelize(obj: Record<string, unknown>) {
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
