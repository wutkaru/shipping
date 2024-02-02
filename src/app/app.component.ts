import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'shipping';
  price = new FormControl(null);
  summary = signal<null | number>(null);
  readonly yen = {
    rate: 0.265,
    ship: 40,
  };
  onClick() {
    const price = this.price.value || 0;
    const pattern = /e/;
    if (price < 100 || price.toString().match(pattern)) {
      return;
    }
    this.summary.set(this.calculate(price));
  }

  canChargeExtra() {
    const currentDate = dayjs(new Date()).startOf('date');
    const calculateDate = dayjs('03/01/2024', 'MM/DD/YYYY').startOf('date');
    return currentDate.isAfter(calculateDate);
  }

  calculate(price: number) {
    let summary = 0;
    const extra = this.canChargeExtra() && price < 2000 ? 50 : 0;
    const cost = Math.ceil((price * this.yen.rate + this.yen.ship) / 5) * 5;
    summary =
      Math.ceil(((265 / 215) * cost + Math.ceil((100 * cost) / 215 / 10)) / 5) *
        5 +
      extra;
    return summary;
  }
}
