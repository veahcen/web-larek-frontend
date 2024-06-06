import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISuccsesOrder {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class SuccessOrder extends Component<ISuccsesOrder> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions) {
        super(container, events);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number){
        this._total.textContent = `Списано ${value} синапсов`;
    }
}
