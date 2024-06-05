import { ICardCategory, CATEGOTY_MAP } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

interface ICard {
  category: string;
  title: string;
  description: string;
  image: string;
  price: number;
  button: string;
}

export class Card extends Component<ICard> {
  private _category: HTMLElement;
	private _title: HTMLElement;
	private _image?: HTMLImageElement;
	private _description?: HTMLElement;
	private _button?: HTMLButtonElement;
	private _price?: HTMLElement;

  constructor(
		protected blockName: string,
		container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container, events);

		
		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);


		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

  set category(value: ICardCategory) {
		this.setText(this._category, value);

		this._category.className = '';
		const mainClass = `${this.blockName}__category`;
		const additionalClass = CATEGOTY_MAP[value];
		this._category.classList.add(mainClass, `${mainClass}_${additionalClass}`);
	}

  set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		this.setText(this._price, value);
		this.setDisabled(this._button, value == null);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}