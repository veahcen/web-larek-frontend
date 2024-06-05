import './scss/styles.scss';

import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Card } from './components/views/Card';
import { SuccessOrder } from './components/views/SuccesOrder';
import { CatalogChangeEv, IFormErrors, IProductCard } from './types';
import { Data } from './components/models/Data';
import { DeliveryForm } from './components/views/DeliveryForm';
import { ContactsForm } from './components/views/ContactsForm';
import { BasketItem } from './components/views/BasketItem';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new Data({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new DeliveryForm(cloneTemplate(deliveryTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEv>('catalog:changed', () => {
	page.galery = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('card:open', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});


events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			valid: appData.getTotalBasketLength() > 0
		}),
	});
});


events.on('card:open', (item: IProductCard) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (appData.cardInBasket(item)) {
				item.removeFromBasket();
			} else {
				item.addToBasket();
			}
			events.emit('card:open', item);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.inBasket ? 'Удалить' : 'Купить',
		}),
	});
});


events.on('card:changed', () => {
	page.counter = appData.getTotalBasketLength();

	basket.items = appData.basket.map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
			onClick: () => {
				item.removeFromBasket(); 
				events.emit('basket:open');
			},
		});
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getBasketTotalPrice();
});


// Открываем первую форму
events.on('order_payment:open', () => {
	const order = appData.createOrder();
	modal.render({
		content: deliveryForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		}),
	});
});

// Изменили способ оплаты
events.on('payment:changed', (data: { target: string }) => {
	appData.order.payment = data.target;
});

// Изменился адрес доставки
events.on('order.address:change', (data: { value: string }) => {
	appData.order.address = data.value;
});

// Изменилась почта
events.on('contacts.email:change', (data: { value: string }) => {
	appData.order.email = data.value;
});

// Изменился телефон
events.on('contacts.phone:change', (data: { value: string }) => {
	appData.order.phone = data.value;
});

// Изменилось состояние валидации формы доставки
events.on('formErrors:changed', (errors: Partial<IFormErrors>) => {
	const { payment, address, email, phone } = errors;
	deliveryForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Заполнили первую форму оплаты
events.on('order:submit', () => {
	events.emit('order_contacts:open');
});

// Открываем вторую форму
events.on('order_contacts:open', () => {
	const order = appData.order;
	modal.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	const order = appData.order;

	api
		.postOrder(
			
			{
				payment: order.payment,
				address: order.address,
				email: order.email,
				phone: order.phone,

				total: appData.getBasketTotalPrice(),
				items: appData.getIdCardsFromBasket(),
			}
		)
		.then((result) => {
			const success = new SuccessOrder(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			// Очищаем корзину сразу
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});


// Блокируем прокрутку страницы при открытии модалки
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модалки
events.on('modal:close', () => {
	page.locked = false;
});


api
	.getCardsList()
	.then((res) => {
		appData.catalog = res;
	})
	.catch(console.error);