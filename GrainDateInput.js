import { html } from '../grain-lit-element/GrainLitElement.js';
import GrainInput from '../grain-input/GrainInput.js';
import GrainTranslate from '../grain-translate/GrainTranslate.js';

export default class GrainDateInput extends GrainInput {

  static get properties() {
    return Object.assign(super.properties, {
      intlOptions: {
        type: 'Json',
        reflectToAttribute: 'intl-options',
        value: {}
      },
      intlLanguage: {
        type: 'String',
        value: 'auto',
        reflectToAttribute: 'intl-language',
        observer: '_onIntlLanguageChange'
      },
    });
  }

  constructor() {
    super();
    this.grainTranslate = new GrainTranslate();

    this.formatter = new Intl.DateTimeFormat(this.intlLanguage, this.intlOptions);
    this._guessFormat();
    this._onIntlLanguageChange();
  }

  _onIntlLanguageChange() {
    if (this.grainTranslate && this.intlLanguage === 'auto') {
      this.intlLanguage = this.grainTranslate.language;
    }
    if (this.lightDomRendered) {
      this.formatter = new Intl.DateTimeFormat(this.intlLanguage, this.intlOptions);
      this.calculateValues(this.formattedValue);
    }
  }

  _guessFormat() {
    let testDate = new Date(Date.UTC(2000,10,22,11,44,0));
    this._separator = new Intl.DateTimeFormat(this.intlLanguage, { 
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC'
    }).format(testDate).match(/[^0-9]+/)[0];

    let testDateString = new Intl.DateTimeFormat(this.intlLanguage, { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(testDate);

    let format = '';
    testDateString.split(this._separator).forEach(part => {
      switch (part) {
        case '22':
          format += 'd';
          break;
        case '11': //11 is 10 above as month are 0 (Jan) - 11 (Dez)
          format += 'm';
          break;
        case '2000':
          format += 'y';
          break;
      }
    });
    this._format = format;
    this._rawPattern = new RegExp(`[0-9\\${this._separator}]`, 'g');
  }

  getRawValue(sourceValue) {
    let rawValue = sourceValue.match(this._rawPattern);
    if (rawValue && rawValue.length > 0) {
      return rawValue.join('');
    }
    return sourceValue;
  }

  getJsValue(value) {
    if (value.split(this._separator).length !== 3) {
      return value;
    }
    let day;
    let month;
    let year;
    switch (this._format) {
      case 'dmy':
        [day, month, year] = value.split(this._separator);
        break;
      case 'mdy':
        [month, day, year] = value.split(this._separator);
        break;
      case 'ymd':
      default:
        [year, month, day] = value.split(this._separator);
    }
    month -= 1; // date month are 0 - 11
    let date = new Date(Date.UTC(year, month, day, 0, 0));
    // offset for for timezone
    date.setHours(date.getHours() + (new Date().getTimezoneOffset() / 60));
    return date;
  }

  getSaveValue(dateObj) {
    if (typeof dateObj === 'object') {
      return dateObj.toISOString();
    }
    return dateObj;
  }

  getFormattedValue(dateObj) {
    if (typeof dateObj === 'object') {
      let formatted = this.formatter.format(dateObj);
      return formatted;
    }
    return dateObj;
  }

}