import { takeEvery, all, delay } from "@redux-saga/core/effects";

import { putWait, withCallback } from '../dist';

function* saga() {
    yield delay(100);

    return "SAGA 1 RETURNED";
}

function* saga2() {
    const result = yield putWait({ type: 'FETCH' });

    return [result, 'SAGA 2 RETURNED'];
}


export default function*() {
    yield all([
        takeEvery('FETCH', withCallback(saga)),
        takeEvery('FETCH2', withCallback(saga2))
    ])
}