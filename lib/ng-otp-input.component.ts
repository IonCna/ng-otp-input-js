import angular from "angular";
import type { IAugmentedJQuery, IComponentController, IComponentOptions, IOnChangesObject, ITimeoutService } from "angular";
import template from "./ng-otp-input.component.html?raw";
import { NgOTPInputConfigService } from "./ng-otp-input.service"
import { NgOtpInputFactory, type INgOptInput } from "./ng-otp-input-state.factory"

function isHtmlInputElement(target: unknown): target is HTMLInputElement {
    return target instanceof HTMLInputElement
}

function isHtmlInputArray(target: unknown[]): target is HTMLInputElement[] {
    const isNotInput = target.find(el => !(el instanceof HTMLInputElement))
    return !Boolean(isNotInput)
}

export class NgOTPInputComponent implements IComponentController {
    private otpMaxLength!: number
    private otpDisabled!: boolean
    private otpOnlyNumbers!: boolean
    private otpKeyboard!: boolean
    private otpOnComplete?: ({ $event }: { $event: unknown }) => boolean

    private digits: string[] = []
    private state!: INgOptInput
    private readonly boundArrowKeyDown = this.onArrowKeyDown.bind(this)

    protected chunks: number[] = []
    protected inputs: HTMLInputElement[] = []

    constructor(
        private ngOTPInputConfigService: NgOTPInputConfigService,
        private $timeout: ITimeoutService,
        private $element: IAugmentedJQuery,
        private ngOtpInputFactory: NgOtpInputFactory
    ) { }

    get SPECIAL_KEYS() {
        return {
            BACKSPACE: "Backspace",
            DELETE: "Delete",
            TAB: "Tab",
            ENTER: "Enter",
            ESCAPE: "Escape",
            ARROW_LEFT: "ArrowLeft",
            ARROW_RIGHT: "ArrowRight",
            HOME: "Home",
            END: "End",
        }
    }

    private isSpecialKey(key: string) {
        return Object.values(this.SPECIAL_KEYS).includes(key)
    }

    private emitCompletedValue() {
        const str = this.digits.join("")
        const result = this.otpOnlyNumbers ? parseInt(str) : str
        this.otpOnComplete?.({ $event: result })
    }

    private focusInput(index: number) {
        const input = this.inputs[index]
        if (!input) return

        this.state.setActiveIndex(index)
        input.focus()
        input.select()
    }

    private resetRenderedInputs() {
        for (const input of this.inputs) {
            input.value = ""
        }
    }

    $onInit(): void {
        this.otpMaxLength = this.otpMaxLength ?? this.ngOTPInputConfigService.maxLength
        this.otpOnlyNumbers = this.otpOnlyNumbers ?? this.ngOTPInputConfigService.onlyNumbers
        this.otpKeyboard = this.otpKeyboard ?? this.ngOTPInputConfigService.keyboard
        this.state = this.ngOtpInputFactory.$create()

        this.otpDisabled = this.otpDisabled ?? false
        this.digits = Array.from({ length: this.otpMaxLength }, () => "")
        this.chunks = Array.from({ length: this.otpMaxLength }, (_, index) => index)
        this.state.setLength(this.otpMaxLength)

        if (this.otpDisabled) {
            this.state.disable()
            return
        }

        this.state.enable()
    }

    $onChanges(changes: IOnChangesObject): void {
        if (changes["otpMaxLength"]?.currentValue != null) {
            this.otpMaxLength = Number(changes["otpMaxLength"].currentValue)
        }

        if (changes["otpDisabled"]?.currentValue != null) {
            this.otpDisabled = Boolean(changes["otpDisabled"].currentValue)
        }

        if (changes["otpOnlyNumbers"]?.currentValue != null) {
            this.otpOnlyNumbers = Boolean(changes["otpOnlyNumbers"].currentValue)
        }

        if (changes["otpKeyboard"]?.currentValue != null) {
            this.otpKeyboard = Boolean(changes["otpKeyboard"].currentValue)
        }

        if (!this.otpMaxLength) return

        this.digits = Array.from({ length: this.otpMaxLength }, () => "")
        this.chunks = Array.from({ length: this.otpMaxLength }, (_, index) => index)

        if (this.state) {
            this.state.setLength(this.otpMaxLength)

            if (this.otpDisabled) {
                this.state.disable()
            } else {
                this.state.enable()
            }
        }

        this.$timeout(() => {
            this.registerInputs()
            this.resetRenderedInputs()
        }, 0, false)
    }

    $postLink(): void {
        this.$timeout(this.registerInputs.bind(this), 0, false)
    }

    protected onKeyUp($event: KeyboardEvent, index: number) {
        if (!$event.target || !isHtmlInputElement($event.target)) return

        if (this.isSpecialKey($event.key)) {
            this.state.send(this.state.EVENTS.KEY_UP)
            return
        }

        const input = $event.target
        const value = input.value.slice(0, 1)

        if (this.otpOnlyNumbers && value && !/^\d$/.test(value)) {
            input.value = ""
            this.digits[index] = ""
            this.state.setValueAt(index, "")
            this.state.send(this.state.EVENTS.KEY_UP)
            return
        }

        input.value = value
        this.digits[index] = value
        this.state.setValueAt(index, value)
        this.state.send(this.state.EVENTS.KEY_UP)

        if (!value) return

        const nextInput = this.inputs[index + 1]
        nextInput?.focus()
        nextInput?.select()

        if (this.digits.every(Boolean)) {
            this.state.send(this.state.EVENTS.COMPLETE)
            this.emitCompletedValue()
        }
    }

    protected onKeyDown($event: KeyboardEvent, index: number) {
        const key = $event.key
        this.state.setActiveIndex(index)

        if (key === this.SPECIAL_KEYS.BACKSPACE) {
            const target = $event.target
            if (isHtmlInputElement(target) && !target.value && index > 0) {
                this.digits[index - 1] = ""
                this.state.setValueAt(index - 1, "")
                this.state.send(this.state.EVENTS.BACKSPACE)
                this.focusInput(index - 1)
                return
            }

            this.digits[index] = ""
            this.state.setValueAt(index, "")
            this.state.send(this.state.EVENTS.BACKSPACE)
            return
        }

        if (key === this.SPECIAL_KEYS.DELETE) {
            this.digits[index] = ""
            this.state.setValueAt(index, "")
            this.state.send(this.state.EVENTS.DELETE)
            return
        }

        if (this.isSpecialKey(key)) return

        this.state.send(this.state.EVENTS.KEY_DOWN)
    }

    protected onFocus($event: FocusEvent) {
        $event.stopPropagation()

        if (!$event?.target) throw new Error("event not found");
        if (!isHtmlInputElement($event.target)) return

        const input = $event.target
        const index = this.inputs.indexOf(input)
        this.state.setActiveIndex(index >= 0 ? index : null)
        this.state.send(this.state.EVENTS.FOCUS)
        input.select()

        if (!this.otpKeyboard) return
        this.addListenArrowControls()
    }

    protected onBlur() {
        this.state.setActiveIndex(null)
        this.state.send(this.state.EVENTS.BLUR)

        if (!this.otpKeyboard) return
        this.removeListenerArrowControls()
    }

    private addListenArrowControls() {
        this.$element.off("keydown", this.boundArrowKeyDown)
        this.$element.on("keydown", this.boundArrowKeyDown)
    }

    private removeListenerArrowControls() {
        this.$element.off("keydown", this.boundArrowKeyDown)
    }

    private onArrowKeyDown(event: JQueryEventObject) {
        if (!this.otpKeyboard) return

        const { key } = event

        if (key != this.SPECIAL_KEYS.ARROW_LEFT && key != this.SPECIAL_KEYS.ARROW_RIGHT) return
        if (!isHtmlInputElement(event.target)) return

        event.preventDefault()
        event.stopPropagation()

        const index = this.inputs.indexOf(event.target)
        const next = key == this.SPECIAL_KEYS.ARROW_LEFT ? index - 1 : index + 1

        if (next < 0 || next > this.otpMaxLength - 1) return
        const input = this.inputs[next]

        const hasText = Boolean(
            angular.element(input).val()
        )

        if (!hasText && next > index) return;

        this.state.setActiveIndex(next)
        this.state.send(
            key == this.SPECIAL_KEYS.ARROW_LEFT
                ? this.state.EVENTS.ARROW_LEFT
                : this.state.EVENTS.ARROW_RIGHT
        )
        this.focusInput(next)
    }

    private registerInputs() {
        const inputs = this.$element.find("input")
        const elements = Array.from(inputs)

        if (!isHtmlInputArray(elements)) return;
        this.inputs = elements;
    }

    static get $name() {
        return "ngOtpInput";
    }

    static get $inject() {
        return [NgOTPInputConfigService.$name, "$timeout", "$element", NgOtpInputFactory.$name]
    }

    static get $factory(): IComponentOptions {
        return {
            controller: NgOTPInputComponent,
            controllerAs: "$",
            template,
            bindings: {
                otpMaxLength: "<?",
                otpDisabled: "<?",
                otpOnlyNumbers: "<?",
                otpOnComplete: "&?",
                otpKeyboard: "<?"
            }
        };
    }
}
