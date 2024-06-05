import {IProductCard, IFormOrder, IData} from "../../types";
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { ProductCard } from "./ProoductCard";
import { FormOrder } from "./FormOrder";

export class Data extends Model<IData> {
  protected _catalog: IProductCard[];
  protected _order: IFormOrder;
  protected _preview: IProductCard;

  constructor(data: Partial<IData>, events: IEvents) {
		super(data, events);
	}

  set catalog(items: IProductCard[]) {
    this._catalog = items.map((item) => new ProductCard(item, this.events));
    this.emitChanges('catalog:changed', { catalog: this.catalog });
  }

  get catalog(): IProductCard[] {
    return this._catalog;
  }

  get basket(): IProductCard[] {
    return  this._catalog.filter((item) => item.inBasket === true)
  }

  get order(): IFormOrder {
    return this._order;
  }

  set preview(card: IProductCard) {
    this._preview = card;
    this.emitChanges('card:open', this.preview);
  }

  get preview(): IProductCard {
    return this._preview;
  }

  cardInBasket(card: IProductCard): boolean {
    return card.inBasket;
  }

  clearBasket(): void {
    this.basket.forEach((card) => card.removeFromBasket());
  }

  getBasketTotalPrice(): number {
    return this.basket.reduce((a, b) => a + b.price, 0);
  }

  getIdCardsFromBasket(): string[] {
    return this.basket.map((item) => item.id);
  }

  getTotalBasketLength(): number {
    return this.basket.length;
  }

  createOrder(): IFormOrder {
    this._order = new FormOrder({}, this.events);
    this.order.clearOrder();
    return this.order;
  }
}