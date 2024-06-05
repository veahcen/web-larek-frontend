import { Model } from "../base/Model";
import { IProductCard } from "../../types";

export class ProductCard extends Model<IProductCard> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inBasket: boolean;

  addToBasket(): void {
    this.inBasket = true;
    this.emitChanges('card:changed', {inBasket: this.inBasket})
  }

  removeFromBasket(): void {
    this.inBasket = false;
    this.emitChanges('card:changed', {inBasket: this.inBasket})
  }
}