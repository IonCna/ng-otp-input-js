export const NG_OTP_INPUT_STATES = {
    IDLE: "IDLE",
    FOCUSED: "FOCUSED",
    TYPING: "TYPING",
    NAVIGATING: "NAVIGATING",
    DELETING: "DELETING",
    PASTING: "PASTING",
    COMPLETED: "COMPLETED",
    DISABLED: "DISABLED",
} as const

export const NG_OTP_INPUT_EVENTS = {
    FOCUS: "FOCUS",
    BLUR: "BLUR",
    INPUT: "INPUT",
    KEY_DOWN: "KEY_DOWN",
    KEY_UP: "KEY_UP",
    BACKSPACE: "BACKSPACE",
    DELETE: "DELETE",
    PASTE: "PASTE",
    ARROW_RIGHT: "ARROW_RIGHT",
    ARROW_LEFT: "ARROW_LEFT",
    COMPLETE: "COMPLETE",
    RESET: "RESET",
    ENABLE: "ENABLE",
    DISABLE: "DISABLE",
} as const

export type NgOtpInputState = typeof NG_OTP_INPUT_STATES[keyof typeof NG_OTP_INPUT_STATES]
export type NgOtpInputEvent = typeof NG_OTP_INPUT_EVENTS[keyof typeof NG_OTP_INPUT_EVENTS]

type NgOtpInputTransitions = Partial<
    Record<NgOtpInputState, Partial<Record<NgOtpInputEvent, NgOtpInputState>>>
>

export interface INgOtpInputContext {
    activeIndex: number | null
    completed: boolean
    disabled: boolean
    length: number
    value: string[]
    lastEvent: NgOtpInputEvent | null
}

export interface INgOptInput {
    readonly STATES: typeof NG_OTP_INPUT_STATES
    readonly EVENTS: typeof NG_OTP_INPUT_EVENTS
    can(event: NgOtpInputEvent): boolean
    disable(): NgOtpInputState
    enable(): NgOtpInputState
    getContext(): Readonly<INgOtpInputContext>
    getState(): NgOtpInputState
    is(state: NgOtpInputState): boolean
    reset(): NgOtpInputState
    send(event: NgOtpInputEvent, patch?: Partial<INgOtpInputContext>): NgOtpInputState
    setActiveIndex(index: number | null): void
    setLength(length: number): void
    setValueAt(index: number, value: string): void
}

class NgOptInput implements INgOptInput {
    private readonly transitions: NgOtpInputTransitions = {
        [NG_OTP_INPUT_STATES.IDLE]: {
            [NG_OTP_INPUT_EVENTS.FOCUS]: NG_OTP_INPUT_STATES.FOCUSED,
            [NG_OTP_INPUT_EVENTS.KEY_DOWN]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.INPUT]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.PASTE]: NG_OTP_INPUT_STATES.PASTING,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.FOCUSED]: {
            [NG_OTP_INPUT_EVENTS.BLUR]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.KEY_DOWN]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.INPUT]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.BACKSPACE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.DELETE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.ARROW_LEFT]: NG_OTP_INPUT_STATES.NAVIGATING,
            [NG_OTP_INPUT_EVENTS.ARROW_RIGHT]: NG_OTP_INPUT_STATES.NAVIGATING,
            [NG_OTP_INPUT_EVENTS.PASTE]: NG_OTP_INPUT_STATES.PASTING,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.TYPING]: {
            [NG_OTP_INPUT_EVENTS.KEY_UP]: NG_OTP_INPUT_STATES.FOCUSED,
            [NG_OTP_INPUT_EVENTS.INPUT]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.COMPLETE]: NG_OTP_INPUT_STATES.COMPLETED,
            [NG_OTP_INPUT_EVENTS.BACKSPACE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.DELETE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.ARROW_LEFT]: NG_OTP_INPUT_STATES.NAVIGATING,
            [NG_OTP_INPUT_EVENTS.ARROW_RIGHT]: NG_OTP_INPUT_STATES.NAVIGATING,
            [NG_OTP_INPUT_EVENTS.BLUR]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.NAVIGATING]: {
            [NG_OTP_INPUT_EVENTS.FOCUS]: NG_OTP_INPUT_STATES.FOCUSED,
            [NG_OTP_INPUT_EVENTS.KEY_DOWN]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.BACKSPACE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.DELETE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.BLUR]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.DELETING]: {
            [NG_OTP_INPUT_EVENTS.KEY_UP]: NG_OTP_INPUT_STATES.FOCUSED,
            [NG_OTP_INPUT_EVENTS.INPUT]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.BLUR]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.PASTING]: {
            [NG_OTP_INPUT_EVENTS.INPUT]: NG_OTP_INPUT_STATES.TYPING,
            [NG_OTP_INPUT_EVENTS.COMPLETE]: NG_OTP_INPUT_STATES.COMPLETED,
            [NG_OTP_INPUT_EVENTS.BLUR]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.COMPLETED]: {
            [NG_OTP_INPUT_EVENTS.FOCUS]: NG_OTP_INPUT_STATES.FOCUSED,
            [NG_OTP_INPUT_EVENTS.BACKSPACE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.DELETE]: NG_OTP_INPUT_STATES.DELETING,
            [NG_OTP_INPUT_EVENTS.RESET]: NG_OTP_INPUT_STATES.IDLE,
            [NG_OTP_INPUT_EVENTS.DISABLE]: NG_OTP_INPUT_STATES.DISABLED,
        },
        [NG_OTP_INPUT_STATES.DISABLED]: {
            [NG_OTP_INPUT_EVENTS.ENABLE]: NG_OTP_INPUT_STATES.IDLE,
        },
    }

    private context: INgOtpInputContext = {
        activeIndex: null,
        completed: false,
        disabled: false,
        length: 0,
        value: [],
        lastEvent: null,
    }

    private state: NgOtpInputState = NG_OTP_INPUT_STATES.IDLE

    public readonly STATES = NG_OTP_INPUT_STATES
    public readonly EVENTS = NG_OTP_INPUT_EVENTS

    public can(event: NgOtpInputEvent): boolean {
        return Boolean(this.transitions[this.state]?.[event])
    }

    public disable(): NgOtpInputState {
        this.context.disabled = true
        return this.send(NG_OTP_INPUT_EVENTS.DISABLE)
    }

    public enable(): NgOtpInputState {
        this.context.disabled = false
        return this.send(NG_OTP_INPUT_EVENTS.ENABLE)
    }

    public getContext(): Readonly<INgOtpInputContext> {
        return Object.freeze({
            ...this.context,
            value: [...this.context.value],
        })
    }

    public getState(): NgOtpInputState {
        return this.state
    }

    public is(state: NgOtpInputState): boolean {
        return this.state === state
    }

    public reset(): NgOtpInputState {
        this.context.activeIndex = null
        this.context.completed = false
        this.context.value = Array.from({ length: this.context.length }, () => "")
        return this.send(NG_OTP_INPUT_EVENTS.RESET)
    }

    public send(event: NgOtpInputEvent, patch?: Partial<INgOtpInputContext>): NgOtpInputState {
        if (patch) {
            this.context = {
                ...this.context,
                ...patch,
                value: patch.value ? [...patch.value] : this.context.value,
            }
        }

        this.context.lastEvent = event

        if (event === NG_OTP_INPUT_EVENTS.COMPLETE) {
            this.context.completed = true
        }

        if (
            event === NG_OTP_INPUT_EVENTS.BACKSPACE ||
            event === NG_OTP_INPUT_EVENTS.DELETE ||
            event === NG_OTP_INPUT_EVENTS.RESET
        ) {
            this.context.completed = false
        }

        const nextState = this.transitions[this.state]?.[event]
        if (nextState) {
            this.state = nextState
        }

        return this.state
    }

    public setActiveIndex(index: number | null): void {
        this.context.activeIndex = index
    }

    public setLength(length: number): void {
        this.context.length = Math.max(0, length)
        this.context.value = Array.from({ length: this.context.length }, (_, index) => this.context.value[index] ?? "")
        this.context.completed = this.isComplete()
    }

    public setValueAt(index: number, value: string): void {
        if (index < 0 || index >= this.context.length) return

        this.context.value[index] = value
        this.context.completed = this.isComplete()
    }

    private isComplete(): boolean {
        return this.context.length > 0 && this.context.value.every(Boolean)
    }
}

export class NgOtpInputFactory {
    static get $name() {
        return "ng.otp.input.state.factory"
    }

    public $create(): INgOptInput {
        return new NgOptInput()
    }
}
