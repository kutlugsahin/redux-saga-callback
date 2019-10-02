import { Action } from "redux";
import { SagaIterator } from "redux-saga";
import { call } from "redux-saga/effects";

export interface ActionWithCallback extends Action{
	onComplete: (error: any, result: any) => void;
}

type SagaType = (action: Action) => SagaIterator; 

export function withCallback(saga: SagaType): SagaType {
	return function* (action: Action): SagaIterator {
		let error;
		let result;
		try {
			result = yield call(saga, action);
		} catch (err) {
			error = err;
		}

		if ((action as ActionWithCallback).onComplete) {
			(action as ActionWithCallback).onComplete(error, result);
		}
	};
}