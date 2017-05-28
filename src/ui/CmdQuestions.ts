import * as moment from 'moment';

export class CmdQuestions {
  static get INITIAL() {
    return [{
      type: 'input',
      name: 'firstName',
      message: 'What\'s your name'
    }, {
      type: 'checkbox',
      name: 'enabledPromos',
      message: 'Select promos you want to enable',
      choices: [
        { name: 'Amaysim Promo Code', value: 'APC', checked: true },
        { name: 'Three for Two Discount (Unlimited 1GB SIM)', value: '3F2', checked: true },
        { name: 'Buy Two Take 1GB Datapack (Unlimited 2GB SIM)', value: '1GB', checked: true },
        { name: 'Price Drop 39.90 (Unlimited 5GB SIM)', value: 'PDR', checked: true }
      ]
    }, {
      type: 'input',
      name: 'promoDate',
      message: 'When will the promos start [YYYY-MM-DD]',
      default: moment().format('YYYY-MM-DD'),
      validate: (value) => {
        const passed = value.match(/\d{4}\-\d{2}-\d{2}/)
        return (passed) ? true : 'Please enter a valid date';
      }
    }, {
      type: 'input',
      name: 'promoPeriod',
      message: 'How many months will the promos end [M]?',
      default: '1',
      validate: (value) => {
        const passed = value.match(/\d{1}/);
        return (passed) ? true : 'Please enter a month period';
      }
    }];
  }

  static get MAIN() {
    return [{
      type: 'list',
      name: 'mainPage',
      message: 'What do you want to do?',
      choices: [
        { name: 'Add Items', value: 'add' },
        { name: 'Checkout', value: 'checkout' },
        { name: 'Exit', value: 'exit' }
      ]
    }];
  }

  static get PROMO() {
    return [{
      type: 'input',
      name: 'promoCode',
      message: `Add promo code [Enter to exit]: `
    }];
  }

  static get EXIT() {
    return [{
      type: 'confirm',
      name: 'simcards',
      message: 'Are you sure you want to exit?'
    }];
  }

  static get SIM_CHOICES() {
    return [
      { name: 'Unlimited 1GB', value: 'ult_small' },
      { name: 'Unlimited 2GB', value: 'ult_medium' },
      { name: 'Unlimited 5GB', value: 'ult_large' },
      { name: '1GB Datapack', value: '1gb' },
      { name: 'Exit', value: 'exit' },
    ];
  }

}
