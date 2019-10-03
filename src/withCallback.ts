import { Action } from "redux";
import { SagaIterator, Saga } from "redux-saga";
import { call, cancelled } from "redux-saga/effects";

export interface OnCompleteResult {
	error?: any;
	cancelled?: boolean;
	data?: any;
};

type OnComplete = (result: OnCompleteResult) => void;

export interface ActionWithCallback extends Action {
	onComplete: OnComplete;
}

function onComplete(action: Action, result: OnCompleteResult) {
	if ((action as ActionWithCallback).onComplete) {
		(action as ActionWithCallback).onComplete(result);
	}
}

export function withCallback(saga: Saga): Saga {
	return function* (action: Action): SagaIterator {
		let error = undefined;
		let data = undefined;
		try {
			data = yield call(saga, action);
		} catch (err) {
			error = err;
		} finally {
			if (yield cancelled()) {
				return onComplete(action, { cancelled: true });
			}
		}

		onComplete(action, {
			error, data
		});
	};
}