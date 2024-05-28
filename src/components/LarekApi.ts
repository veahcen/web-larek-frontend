
import { IProductCard, IOrderApi, IOrderResult } from '../types';

interface ILarekApi {
  getCardsList(): Promise<IProductCard[]>;
  getCardItem(id: string): Promise<IProductCard>;
  postOrder(order: IOrderApi): Promise<IOrderResult>;
}