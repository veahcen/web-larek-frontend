export interface IProductCard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  inBasket: boolean;
}

export interface IFormOrder {
  payMethod: string;
  address: string;
  email: string;
  phone: string;
  total: number;
}

export interface ICardsData {
  cards: IProductCard[];
  preview: string | null;
  showAllCards(cards: IProductCard[]): Record<keyof TCardMain, string>[];
  setItems(items: Record<keyof TCardInBasket, string>): void;
  getCard(cardId: string): Record<keyof TCardInBasket, string>;
  deleteProductCardFromBasket(cardId: string, payload: Function | null): void;
  checkCardInBasket(cardId: string): boolean;
  checkPrice(price: string): boolean;
}

export interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
}

export interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}

export interface TFormData {
  getFormInfo(): IFormOrder;
  setFormInfo(formData: IFormOrder): void;
  clearForm(formData: IFormOrder): void;
}

export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmitter): IViewConstructor;
}

export interface IView {
  render (data?: object): HTMLElement;
}

export type TCardMain = Pick<IProductCard, 'image' | 'title' | 'category' | 'price'>;

export type TCardInBasket = Pick<IProductCard, 'title' | 'price'>;

export type TAddressAndPay = Pick<IFormOrder, 'payMethod' | 'address'>;

export type TEmailAndPhone = Pick<IFormOrder, 'email' | 'phone'>;