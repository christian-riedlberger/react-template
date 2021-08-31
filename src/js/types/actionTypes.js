// @flow
export type Action =
    | { type: 'LOGGED_IN', payload: Object }
    | { type: 'FETCH_NODE', payload: boolean }
    | { type: 'FETCH_NODE_VERSIONS', payload: Object }
    | { type: 'CREATE_FOLDER', payload: Object }
    | { type: 'UPDATE_FOLDER', payload: Object }
    | { type: 'DELETE_NODE', payload: Object }
    | { type: 'CLEAR_ACTIVE_FOLDER', payload: Object }
    | { type: 'TOGGLE_DOC_ITEM', payload: { nodeRef: string; isSelected: boolean} }
    | { type: 'UPLOAD_FILE', payload: boolean }
    | { type: 'MOVE_FOLDER', payload: Object }
    | { type: 'CHANGE_ACTIVE_FOLDER', payload: Object }
    | { type: 'UPLOAD_FILE_PROGRESS', payload: Object }
    | { type: 'FETCH_PICKER_FOLDER', payload: Object }
    | { type: 'ADD_PICKER_ITEM', node: Object }
    | { type: 'REMOVE_PICKER_ITEM', nodeRef: string }
    | { type: 'CLEAR_PICKER_ACTIVE', payload: boolean }
    | { type: 'LOADING', payload: Object }
    | { type: 'FETCH_ASSOCIATIONS', payload: Object }
    | { type: 'FETCH_ASSESSMENTS', payload: Object }
    | { type: 'FETCH_LOCATIONS', payload: Object }
    | { type: 'FETCH_ORGANIZATIONS', payload: Object };

export type GetState = () => Object;
export type Repository = () => Object;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState, repo: Repository) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
