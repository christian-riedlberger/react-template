export const clearLocalStorage = () => {
    localStorage.removeItem('auth:expires');
    localStorage.removeItem('auth:remember');
    localStorage.removeItem('auth:ticket');
    localStorage.removeItem('auth:username');
    localStorage.removeItem('auth:verified');
    localStorage.removeItem('auth:userIsAdmin');
    localStorage.removeItem('org:active');
};

export function other() {}
