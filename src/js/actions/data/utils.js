// @flow
import faker from 'faker';

/**
 * choose a random item from an array
 */
export const choice = array => array[faker.random.number(array.length - 1)];

/**
 * create an array of n sized, and fill with the results of the function
 */
export const fill = (len: Number, func: Function) =>
    Array(len || 1)
        .fill(null)
        .map(func);

/**
 * get value from localStorage, orreturn default value
 */
export const getFromStorage = (domain: string, defaultValue: any) => {
    const raw = localStorage.getItem(domain);
    const value = JSON.parse(raw);
    if (!value) return defaultValue;
    return value;
};

/**
 * return data after delay elapsed
 */
export const sleep = (delay, obj) =>
    // eslint-disable-next-line compat/compat
    new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    data: obj
                }),
            delay
        )
    );
