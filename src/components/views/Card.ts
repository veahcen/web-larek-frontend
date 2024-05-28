
interface ICardActions {
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