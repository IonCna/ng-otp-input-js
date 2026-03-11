import angular from "angular";
import { NgOTPInputComponent } from "./ng-otp-input.component"
import { NgOtpInputFactory } from "./ng-otp-input-state.factory"
import { NgOTPInputConfigService } from "./ng-otp-input.service"

export const NgOtpInputModule = angular.module("ng.otp.input", [])
NgOtpInputModule.component(NgOTPInputComponent.$name, NgOTPInputComponent.$factory)
NgOtpInputModule.factory(NgOtpInputFactory.$name, NgOtpInputFactory)
NgOtpInputModule.service(NgOTPInputConfigService.$name, NgOTPInputConfigService)
