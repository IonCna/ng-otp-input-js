import angular from 'angular';

import { appRootComponent } from './app-root.component';
import { NgOtpInputModule } from "../../lib/ng-otp-input.module"

export const appModule = angular
  .module('app', [NgOtpInputModule.name])
  .component('appRoot', appRootComponent);
