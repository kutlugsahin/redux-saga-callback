import { CallEffect, Effect, call, all, take, put } from 'redux-saga/effects';
import { eventChannel, EventChannel, END } from 'redux-saga';
import { Action } from 'redux';

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
	return call(function* (): IterableIterator<Effect<any>> {
		const channel = yield call(createCallbackChannel, action);
		const [{ err, result }] = yield all([take(channel), put(action)]);
		if (err) {
			throw err;
		}

		return result;
	});
}