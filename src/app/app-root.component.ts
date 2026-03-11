import type { IComponentOptions } from 'angular';
import template from './app-root.component.html?raw';

class AppRootController {
  public title = 'ng-otp-input-js';
  public description =
    'Componente OTP para AngularJS con estado finito, navegacion por teclado y configuracion simple.';
  public completedValue = '----';
  public otpMaxLength = 4;
  public otpDisabled = false;
  public otpOnlyNumbers = true;
  public otpKeyboard = true;
  public readonly highlights = [
    {
      eyebrow: 'Estado',
      title: 'FSM ligera',
      text: 'La demo usa el mismo flujo de estados del componente para mantener la interaccion predecible.',
    },
    {
      eyebrow: 'Bindings',
      title: 'Configurable',
      text: 'Puedes alternar numero de digitos, bloqueo del teclado y solo numeros desde la misma vista.',
    },
    {
      eyebrow: 'AngularJS',
      title: 'Clase + HTML',
      text: 'Los componentes del demo siguen el mismo patron de clase TypeScript con template separado.',
    },
  ];

  public handleOtpComplete(value: string | number) {
    this.completedValue = String(value);
  }

  public toggleNumbersMode() {
    this.otpOnlyNumbers = !this.otpOnlyNumbers;
    this.completedValue = '----';
  }

  public toggleKeyboardMode() {
    this.otpKeyboard = !this.otpKeyboard;
  }

  public toggleDisabledMode() {
    this.otpDisabled = !this.otpDisabled;
  }

  public increaseLength() {
    if (this.otpMaxLength >= 6) return;
    this.otpMaxLength += 1;
    this.completedValue = '----';
  }

  public decreaseLength() {
    if (this.otpMaxLength <= 4) return;
    this.otpMaxLength -= 1;
    this.completedValue = '----';
  }
}

export const appRootComponent: IComponentOptions = {
  controller: AppRootController,
  template,
};
