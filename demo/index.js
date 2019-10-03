import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import saga from './saga';

const sagaMiddleware = createSagaMiddleware();

function reducer(state = {}, action) {
    switch (action.type) {    
        default:
            return state;
    }
}

const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);


store.dispatch({
    type: 'FETCH2',
    onComplete: ({ error, cancelled, data }) => {
        console.log(data);
    }
})
