# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Данные и типы данных, используемые в приложении

Карточка

```
export interface IProductCard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  inBasket: boolean;
}
```

Форма заказа

```
export interface IFormOrder {
  payMethod: string;
  address: string;
  email: string;
  phone: string;
  total: number;
}
```

Интерфейс для модели данных карточек

```
export interface ICardsData {
  cards: IProductCard[];
  preview: string | null;
  setItems(items: Record<keyof TCardInBasket, string>): void;
  getCard(cardId: string): Record<keyof TCardInBasket, string>;
  deleteProductCardFromBasket(cardId: string, payload: Function | null): void;
  checkCardInBasket(cardId: string): boolean;
  checkPrice(price: string): boolean;
}
```

Интерфейс для модели данных корзины

```
export interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
}
```

Интерфейс для модели данных событий

```
export interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}
```

Интерфейс для модели данных формы

```
export interface TFormData {
  getFormInfo(): IFormOrder;
  setFormInfo(formData: IFormOrder): void;
}
```

Интерфейс конструктора, на фходе контейнер и выводим в него  

```
export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmitter): IViewConstructor;
}
```

Интерфейс класса отображения

```
export interface IView {
  render (data?: object): HTMLElement;
}
```

Данные для отображения карточки на главной странице

```
export type TCardMain = Pick<IProductCard, 'image' | 'title' | 'category' | 'price'>;
```

Основные данные для отображения карточек товаров в корзине

```
export type TCardInBasket = Pick<IProductCard, 'title' | 'price'>;
```

Данные для заполнения полей с информацией в первой части формы

```
export type TAddressAndPay = Pick<IFormOrder, 'payMethod' | 'address'>;
```

Данные для заполнения полей с информацией во второй части формы

```
export type TEmailAndPhone = Pick<IFormOrder, 'email' | 'phone'>;
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - снять подписку на событие
- `emit` - инициализация события
- `onAll` - Слушать все события
- `offAll` - Сбросить все обработчики
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### ICardsData
Класс отвечает за хранение и логику работы с карточками.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- cards: IProductCard[] - массив объекта карточек
- preview: string | null - id карточки, выбранной для просмотра в модальном окне.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- showAllCards(cards: IProductCard[]): Record<keyof TCardMain, string>[] - информация о карточках на главной странице.
- setItems(items: Record<keyof TCardInBasket, string>): void - добавляет карточку в корзину.
- getCard(cardId: string): Record<keyof TCardInBasket, string> - отоюражает карточку в корзине.
- deleteProductCardFromBasket(cardId: string, payload: Function | null): void - удалет карточку из корзины.
- checkCardInBasket(cardId: string): boolean - проверяет добавлена ли карточка в корзину.
- checkPrice(price: string): boolean - проверяет бесценна ли карточка.

#### IBasketModel
Класс который отвечает за логику работы корзины.
В полях класса хранятся следующие данные:
- items - массив с неповторающимеся товарами.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- add(id: string): void - добавление в массив корзыны товара.
- remove(id: string): void- удаление из массивы корзыны товара.

#### TFormData
Класс, который отвечает за работу с полями формы.

Класс предоставляет набор методов для взаимодействия с данными формы.
- getFormInfo(): IFormOrder - получаем данные формы.
- setFormInfo(formData: IFormOrder): void - заполняем данные формы.
- clearForm(formData: IFormOrder): void - очистка формы от данных.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс BasketItemView
Расширяет класс Modal. Класс отвечающий за отображение полей в модальном окне корзины.
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения.
- title: string - текст карточки.
- price: number - цена карточки.
- total: number - общая сумма заказа.

Методы:
- deleteCard(cardId: string): void - удаление карточки из списка отображаемого. 
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.

#### Класс CardItemView
Расширяет класс Modal. Предназначен для реализации модального окна с отображением данных о карточке. При открытии модального окна получает данные карточки, которые нужно показать.\
Также имеет кнопку добавления в корзину.

Поля класса:
- categoryElement: HTMLElementnt - элемент разметки с категорией товара.
- titleElement: HTMLElementnt - элемент разметки с заголовоком товара.
- imageElement: HTMLElement - элемент разметки с изображением товара.
- descriptionElement: HTMLElement - элемент разметки с описанием товара.
- priceElement: HTMLElement - элемент разметки с ценой товара.
- addButton: HTMLButtonElement - кнопка добавления товара в корзину.\

Методы:
- open(data: { category: string, title: string, description: string, image: string, price: number}): void - расширение родительского метода, принимает данные карточки, которые используются для заполнения атрибутов элементов модального окна.
- setAdd(isAdd: boolean): void - изменяет активность кнопки добавления.
- checkPrice(price: boolean): void - проверка цены на null.

#### Класс firstStepOrder
Расширяет класс Modal. Предназначен для реализации модального окна c заполнением первых данных формы.\

Поля класса:
- _form: HTMLFormElement - элемент формы
- payMethodElement: HTMLElementnt - элемент разметки с методом оплаты.
- addressElement: HTMLElementnt - элемент разметки с адресом доставки.
- nextButton: HTMLButtonElement - кнопка которая переводит на 2-ю часть формы.\

Методы:
- setNext(isNext: boolean): void - изменяет активность кнопки далее
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы.

#### Класс secondStepOrder
Расширяет класс Modal. Предназначен для реализации модального окна c заполнением вторых данных формы.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения.
- _form: HTMLFormElement - элемент формы.
- emailElement: HTMLElementnt - элемент разметки с почтой пользователя.
- phoneElement: HTMLElementnt - элемент разметки с телефоном пользователя.

Методы:
- setOrder(isOrder: boolean): void - изменяет активность кнопки для оформления заказа.
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы.

#### Класс endStepOrder
Расширяет класс Modal. Предназначен для реализации модального окна c завершенной покупкой.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения.
- _form: HTMLFormElement - элемент формы.
- totalElement: HTMLElementnt - элемент разметки с общей суммой.

Методы:
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `formOrder:changed` - изменение данных формы
- `form:previewClear` - необходима очистка данных в модальном окне формы

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `productcard:select` - выбор карточки для отображения в модальном окне.
- `basket:open` - открытие модального окна корзины с отображением добавленных карточек.
- `add-productcard:submit` - добавление карточки в корзину.
- `remove-productcard:card:submit` - удаление карточки из корзины.
- `new-order:submit` - событие, генирируемое при оформлении заказа.
- `edit-form1:input` - изменение данных в форме с данными заказа1.
- `edit-form2:input` - изменение данных в форме с данными заказа2.
- `order:submit` - оформление заказа. 