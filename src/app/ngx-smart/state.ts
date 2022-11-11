import {BehaviorSubject, EMPTY, map, Observable} from "rxjs";
import {select} from './utils'

type Path = string;
type SelectFn<T> = (state: T) => any
export type SelectArg<T> = Path | Path[] | SelectFn<T> | SelectFn<T>[] | Array<Path | SelectFn<T>>;

export class State<T extends object> {
  private readonly state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject(initialState);
  }

  public select(select: SelectArg<T>): Observable<any> {
    // if (Array.isArray(select)) {
    //   return this.state$.pipe(
    //     map(
    //       state => this.selectBy(state)
    //     )
    //   )
    // }

    return this.selectBy(select);
  }

  private selectBy(select: SelectArg<T>) {
    if (typeof select === 'string') {
      return this.selectByPath(select)
    }

    if (typeof select === 'function') {
      return this.selectByFn(select)
    }

    return EMPTY
  }

  private selectByPath(path: string) {
    return this.state$
      .pipe(
        map(state => select(state, path))
      )
  }

  private selectByFn(fn: SelectFn<T>) {
    return this.state$
      .pipe(
        map(fn)
      )
  }
}

