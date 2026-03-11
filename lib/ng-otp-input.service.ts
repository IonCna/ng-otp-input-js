export class NgOTPInputConfigService {
    public maxLength = 4
    public onlyNumbers = false
    public keyboard = true

    static get $name() {
        return "ng.otp.input.config.service"
    }
}