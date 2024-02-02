import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

const selectCounterState = (state: AppState) => state.counter;

const selectCount = createSelector(
    selectCounterState,
    (state)=>state.count
)

export { selectCounterState, selectCount }