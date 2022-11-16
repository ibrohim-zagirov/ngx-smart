import {BehaviorSubject, combineLatest, EMPTY, map, Observable} from "rxjs";
import {getValueToUpsert, select} from './utils'

type Path = string;
type StateCallback<T> = (state: T) => any
export type Selector<T> = Path | Path[] | StateCallback<T> | StateCallback<T>[] | Array<Path | StateCallback<T>>;

export type UpdaterData<T> = Path | [Path, any] | [Path, StateCallback<T>] | Selector<T> | object

export class State<T extends object> {
  private readonly state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject(initialState);
  }

  public select(selector?: Selector<T>): Observable<any> {
    if (!selector) {
      return this.state$.asObservable()
    }
    if (Array.isArray(selector)) {
      return combineLatest(
        selector.map(
          selectEl => this.selectBy(selectEl)
        )
      )
    }
    return this.selectBy(selector);
  }

  public update(data: UpdaterData<T>): void {
    if (typeof data === 'function') {
      return this.state$.next(
        data(this.state$.value)
      )
    }

    if (typeof data === "object" && !Array.isArray(data) && data !== null) {
      this.state$.next({
        ...this.state$.value,
        ...data
      })
    }

    if (Array.isArray(data)) {
      if (typeof data[0] === 'string' && data[1]) {
        this.update(getValueToUpsert(data as [string, any]))
      }
    }
  }

  private selectBy(select: Selector<T>) {
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

  private selectByFn(fn: StateCallback<T>) {
    return this.state$
      .pipe(
        map(fn)
      )
  }
}

