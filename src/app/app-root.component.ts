import type { IComponentController, IComponentOptions } from 'angular';
import template from './app-root.component.html?raw';

class AppRootController implements IComponentController {
  public title = 'ng-otp-input-js';
  public description =
    'Componente OTP para AngularJS con navegacion por teclado, configuracion simple y una integracion directa.';
  public completedValue = '';
  public otpMaxLength = 4;
  public otpDisabled = false;
  public otpOnlyNumbers = true;
  public otpKeyboard = true;
  public readonly highlights = [
    {
      eyebrow: 'Experiencia',
      title: 'Interaccion fluida',
      text: 'El componente responde bien al teclado y mantiene una captura de codigo clara para el usuario.',
    },
    {
      eyebrow: 'Bindings',
      title: 'Configurable',
      text: 'Puedes alternar numero de digitos, bloqueo del teclado y solo numeros desde la misma vista.',
    },
    {
      eyebrow: 'Integracion',
      title: 'Facil de usar',
      text: 'Se integra rapido en vistas AngularJS y expone opciones claras para ajustar el comportamiento.',
    },
  ];

  $onInit(): void {
    this.completedValue = this.getPlaceholderValue();
  }

  private getPlaceholderValue() {
    return '-'.repeat(this.otpMaxLength);
  }

  public handleOtpComplete(value: string | number) {
    this.completedValue = String(value);
  }

  public toggleNumbersMode() {
    this.otpOnlyNumbers = !this.otpOnlyNumbers;
    this.completedValue = this.getPlaceholderValue();
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
    this.completedValue = this.getPlaceholderValue();
  }

  public decreaseLength() {
    if (this.otpMaxLength <= 4) return;
    this.otpMaxLength -= 1;
    this.completedValue = this.getPlaceholderValue();
  }
}

export const appRootComponent: IComponentOptions = {
  controller: AppRootController,
  template,
};
