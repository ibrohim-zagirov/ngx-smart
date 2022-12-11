import { Component } from '@angular/core';
import { createState } from './ngx-smart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private readonly state$ = createState({
    user: {
      address: {
        city: 'New York',
      },
    },
  });

  private readonly city$ = this.state$.select('user.address.city');
  private readonly multi$ = this.state$.select([
    'user.address.city',
    (state) => state.user.address.city,
  ]);
  private readonly cityByFn$ = this.state$.select(
    (state) => state.user.address.city
  );
  title = 'ngx-smart';

  constructor() {
    console.log(this.state$.value);
    this.state$.subscribe((res) => console.log({ res }));
    this.city$.subscribe(console.log);
    this.cityByFn$.subscribe(console.log);
    this.multi$.subscribe((multi) => console.log({ multi }));
    this.state$.select().subscribe(console.log);
    this.state$.update((state) => ({
      ...state,
      user: {
        ...state.user,
        address: {
          ...state.user.address,
          city: 'Moscow',
        },
      },
    }));
    this.state$.update({ user: { address: { city: 'London' } } });
    this.state$.update(['user.address.city', 'Cairo']);
  }
}
