/* @flow */
/**
 * Set pagination
 */
export function setPagination(namespace: string, page: number) {
    return {
        type: 'SET_PAGINATION',
        payload: {
            namespace,
            page
        }
    };
}

/**
 * Clear pagination
 */
export function clearPagination() {
    return {
        type: 'CLEAR_PAGINATION',
        payload: {}
    };
}
