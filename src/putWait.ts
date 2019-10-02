import { Action } from 'redux';
import { END, eventChannel, EventChannel, SagaIterator } from 'redux-saga';
import { all, call, CallEffect, put, take } from 'redux-saga/effects';

function createCallbackChannel(action: any): EventChannel<any> {
	return eventChannel((emit: any) => {
		action.onComplete = (err: any, result: any) => {
			emit({
				err,
				result,
			});

			emit(END);
		};
		return () => {
			return;
		};
	});
}

export function putWait(action: Action): CallEffect {
	return call(function* (): SagaIterator {
		const channel = yield call(createCallbackChannel, action);
		const [{ err, result }] = yield all([take(channel), put(action)]);
		if (err) {
			throw err;
		}

		return result;
	});
}