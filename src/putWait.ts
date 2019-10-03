import { Action } from 'redux';
import { END, eventChannel, EventChannel, SagaIterator } from 'redux-saga';
import { all, call, CallEffect, put, take } from 'redux-saga/effects';
import { ActionWithCallback, OnCompleteResult } from './withCallback';

function createCallbackChannel(action: ActionWithCallback): EventChannel<any> {
	return eventChannel((emit: any) => {
		action.onComplete = (result) => {
			emit(result);
			emit(END);
		};
		return () => {
			return;
		};
	});
}

export function putWait(action: Action): CallEffect {
	return call(function* (): SagaIterator {
		const channel = yield call(createCallbackChannel, action as ActionWithCallback);
		const [{ error, cancelled, data }]: [OnCompleteResult] = yield all([take(channel), put(action)]);
		if (error) {
			throw error;
		}

		if (cancelled) {
			return undefined;
		}

		return data;
	});
}