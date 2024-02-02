import { createReducer, on } from "@ngrx/store";
import { decrement, increment, reset } from "./counter.actions";

interface CounterState {
    count: number
}

const initialCounterState: CounterState = {
    count: 0
}

const CounterReducer = createReducer(
    initialCounterState,
    on(increment, state => ({...state, count: state.count + 1})),
    on(decrement, state => ({...state, count: state.count - 1})),
    on(reset, state => ({...state, count: 0}))
)
export { CounterState, initialCounterState, CounterReducer };