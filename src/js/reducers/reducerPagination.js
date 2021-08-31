// @flow
export default function(
    state: Object = {
        paginations: {}
    },
    action: Object
) {
    switch (action.type) {
        case 'SET_PAGINATION': {
            const newState = { ...state };

            newState.paginations[action.payload.namespace] =
                action.payload.page;
            return newState;
        }
        case 'CLEAR_PAGINATION': {
            const newState = { ...state };
            newState.paginations[action.payload.namespace] = 0;
            return newState;
        }
        default: {
            return state;
        }
    }
}
