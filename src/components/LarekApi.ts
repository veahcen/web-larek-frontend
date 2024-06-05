import { Api, ApiListResponse } from './base/api';
import { IProductCard, IOrderApi, IOrderResult } from '../types';

interface ILarekApi {
  getCardsList(): Promise<IProductCard[]>;
  getCardItem(id: string): Promise<IProductCard>;
  postOrder(order: IOrderApi): Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {

  private readonly staticDomen: string;

  constructor(staticDomen: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.staticDomen = staticDomen;
	}

  getCardsList(): Promise<IProductCard[]> {
		return this.get('/product/').then((data: ApiListResponse<IProductCard>) =>
			data.items.map((item) => ({
				...item,
				image: this.staticDomen + item.image,
			}))
		);
	}

  getCardItem(id: string): Promise<IProductCard> {
		return this.get(`/product/${id}`).then((item: IProductCard) => ({
			...item,
			image: this.staticDomen + item.image,
		}));
	}

  postOrder(order: IOrderApi): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}

}