# NgInputOTP for AngularJS

Componente OTP para AngularJS 1.x escrito en TypeScript.

Incluye:

- longitud configurable
- modo solo números
- estado deshabilitado
- navegación con teclado
- callback al completar el código
- demo local para pruebas visuales

## Estado

El proyecto ya puede construirse y probarse localmente.

Por ahora:

- no tiene soporte para `paste`
- aun no se publica en npm
- si puede versionarse y publicarse como release en GitHub

## Scripts

```bash
npm run dev
```

Levanta la demo local con Vite.

```bash
npm run build:demo
```

Construye la demo.

```bash
npm run build:lib
```

Construye la librería en `dist/`.

## Estructura

```text
lib/
  ng-otp-input.component.ts
  ng-otp-input.component.html
  ng-otp-input.module.ts
  ng-otp-input.service.ts
  ng-otp-input-state.factory.ts
  index.ts

src/
  app/
    app-root.component.ts
    app-root.component.html
```

## Uso básico

Registra el modulo:

```ts
import angular from 'angular';
import { NgOtpInputModule } from './lib/ng-otp-input.module';

angular.module('app', [NgOtpInputModule.name]);
```

Y usa el componente:

```html
<ng-otp-input
  otp-max-length="4"
  otp-disabled="false"
  otp-only-numbers="true"
  otp-keyboard="true"
  otp-on-complete="$ctrl.handleOtpComplete($event)"
></ng-otp-input>
```

## Bindings

### `otpMaxLength`

Numero de dígitos del OTP.

### `otpDisabled`

Desactiva los inputs.

### `otpOnlyNumbers`

Restringe la captura a caracteres numéricos.

### `otpKeyboard`

Activa o desactiva la navegación con flechas.

### `otpOnComplete`

Callback que se dispara cuando todos los dígitos han sido capturados.

## Configuration global

Puedes ajustar valores por defecto desde `NgOTPInputConfigService`:

```ts
configService.maxLength = 4;
configService.onlyNumbers = true;
configService.keyboard = true;
```

## Build output

El build de librería genera:

- `dist/lib` para salida ESM
- `dist/cjs` para salida CommonJS
- `dist/types` para declaraciones TypeScript

## Release

Tag recomendado para la primera release en GitHub:

```text
v0.1.0
```

## Notas

AngularJS 1.x ya no tiene soporte activo oficial, asi que este proyecto esta orientado a mantenimiento o integraciones sobre aplicaciones existentes en AngularJS.
