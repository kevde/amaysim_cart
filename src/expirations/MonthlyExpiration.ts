import * as moment from 'moment';
export class MonthlyExpiration {
  startDate: Date;
  period: number;

  constructor(startDate: Date, period: number) {
    this.startDate = startDate;
    this.period = period;
  }

  getExpirationDate() {
    const expirationDate = moment(this.startDate).add(this.period, 'month');
    return expirationDate.toDate();
  }

  isDateValid(currentDate: Date) {
    return moment(currentDate).isBetween(this.startDate, this.getExpirationDate());
  }
}
