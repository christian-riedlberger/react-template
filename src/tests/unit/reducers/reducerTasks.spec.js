import reducerTasks, { initialState } from 'reducers/reducerTasks';
import {
    FETCH_ISSUED_TASKS,
    FETCH_RECEIVED_TASKS
    // CLEAR_RECEIVED_TASKS,
    // CLEAR_ISSUED_TASKS
} from 'constants/ActionTypes';

// eslint-disable-next-line import/extensions
import data from './tasks.json';

describe('reducerTasks.js', () => {
    describe(FETCH_ISSUED_TASKS, () => {
        const fetchTasks = responseData => {
            const action = {
                type: `${FETCH_ISSUED_TASKS}_FULFILLED`,
                payload: { data: responseData }
            };

            return reducerTasks(initialState, action);
        };

        it('should handle issued cert tasks', () => {
            expect(fetchTasks(data.certTasksIssued)).toMatchSnapshot();
            expect(
                fetchTasks(data.certTasksIssuedWithoutRefs)
            ).toMatchSnapshot();
        });

        it('should handle recieved spec tasks', () => {
            expect(fetchTasks(data.specTasksIssued)).toMatchSnapshot();
        });
    });

    describe(FETCH_RECEIVED_TASKS, () => {
        const fetchTasks = responseData => {
            const action = {
                type: `${FETCH_RECEIVED_TASKS}_FULFILLED`,
                payload: { data: responseData }
            };

            return reducerTasks(initialState, action);
        };

        it('should handle recieved cert tasks', () => {
            expect(fetchTasks(data.certTasksRecieved)).toMatchSnapshot();
            expect(
                fetchTasks(data.certTasksRecievedWithoutRefs)
            ).toMatchSnapshot();
        });

        it('should handle recieved spec tasks', () => {
            expect(fetchTasks(data.specTasksRecieved)).toMatchSnapshot();
        });
    });
});
