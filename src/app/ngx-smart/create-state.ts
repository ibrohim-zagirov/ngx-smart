import {State} from "./state";

export function createState<T extends object>(initialState: T): State<T> {
  return new State<T>(initialState)
}
