import { Action } from "redux";
import { Effect, call } from "redux-saga/effects";

export interface ActionWithCallback extends Action{
	onComplete: (error: any, result: any) => void;
}

type SagaType = (action: Action) => IterableIterator<any>; 

export function withCallback(saga: SagaType): SagaType {
	return function* (action: Action): IterableIterator<Effect> {
		let error: any;
		let result: any;
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