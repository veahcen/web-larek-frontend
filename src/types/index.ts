export interface IProductCard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inBasket: boolean;
  addToBasket(): void;
  removeFromBasket(): void;
}

export interface IFormOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  formErrors: IFormErrors;
  items: IProductCard[];

  validateOrder(): void;
  clearOrder(): void;
  validatePayMethod(): void;
  validateAddres(): void;
  validateEmail(): void;
  validatePhone(): void;
  postOrder(): void;
}

export interface IData {
  _catalog: IProductCard[];
  _order: IFormOrder;
  _preview: IProductCard;

  set catalog(cards: IProductCard[]);
  get catalog(): IProductCard[];
  set order(order: IFormOrder);
  get order(): IFormOrder;
  get basket(): IProductCard[];
  set preview(order: IProductCard);
  get preview(): IProductCard;
  cardInBasket(card: IProductCard): boolean;
  getBasketTotalPrice(): number;
  getTotalBasketLength(): number;
  getIdCardsFromBasket(): string[];
  clearBasket(): void;
  createOrder(): IFormOrder;
}

export interface IOrderApi  {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
	total: number;
}

export type IFormErrors = Partial<Record<keyof IFormOrder, string>>;

export type ICardCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export  const CATEGOTY_MAP: Record<ICardCategory, string> = {
	'софт-скил': 'soft',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
	'хард-скил': 'hard',
};

export type CatalogChangeEv = {
	catalog: IProductCard[];
};