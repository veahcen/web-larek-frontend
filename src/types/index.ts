export interface IProductCard {
  _id: string;
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
  _payMethod: string;
  _address: string;
  _email: string;
  _phone: string;
  _formErrors: string;
  _items: TCardInBasket[];

  set payMethod(pay: string);
  get payMethod(): string;
  set address(address: string);
  get address(): string;
  set email(email: string);
  get email(): string;
  set phone(phone: string);
  get phone(): string;
  set items(items: TCardInBasket[]);
  get items(): TCardInBasket[];
  validateOrder(): void;
  clearOrder(): void;
  validdatePayMethod(): void;
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
  set preview(order: IProductCard);
  get preview(): IProductCard;
  cardInBasket(card: IProductCard): boolean;
  get basketTotaalPrice(): number;
  get totalBasketLength(): number;
  get idCardsFromBasket(): string[];
  clearBasket(): void;
}

export interface IOrderApi {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
	total: number;
}

export type TCardMain = Pick<IProductCard, '_id' | 'image' | 'title' | 'category' | 'price' | 'inBasket'>;

export type TCardInBasket = Pick<IProductCard, '_id' | 'title' | 'price' | 'inBasket'>;

export type TAddressAndPay = Pick<IFormOrder, 'payMethod' | 'address'>;

export type TEmailAndPhone = Pick<IFormOrder, 'email' | 'phone'>;