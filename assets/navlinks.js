export const navlinks = [
  { name: "Главная", path: "/", icon: "el-icon-s-home" },
  { name: "Заказы", path: "/orders", icon: "el-icon-shopping-cart-full" },
  { name: "Онлайн заказы", path: "/online" },
  { name: "Каталог", path: "/menu", icon: "el-icon-document" },
  { name: "Товары", path: "/products" },
  { name: "Бренды", path: "/brands" },
  { name: "Категории товаров", path: "/categories" },
  { name: "Склад", path: "/storage", icon: "el-icon-receiving" },
  { name: "Поставки", path: "/supply" },
  { name: "Поставщики", path: "/suppliers" },
  { name: "Склады", path: "/store" },
  { name: "Остатки", path: "/calculation" },
  { name: "Остатки", path: "/calculation" },
  { name: "Клиенты", path: "/users", icon: "el-icon-user" },
  { name: "Курьеры", path: "/delivers", icon: "el-icon-truck" },
  { name: "Отчеты", path: "/reports", icon: "el-icon-s-marketing" },
  { name: "Отчет по продуктам", path: "/product-reports" },
  { name: "Все клиенты", path: "/all_users" },
  { name: "Активные Клиенты", path: "/active" },
  { name: "Доступ", path: "/access", icon: "el-icon-unlock" },
  { name: "Отп-сооб", path: "/send_message", icon: "el-icon-s-promotion" },
  { name: "Слайдер", path: "/shop_carousel" },
  { name: "Категории", path: "/shop_category" },
  { name: "Отмененные заказы", path: "/canceled" },
  { name: "Доставление заказы", path: "/delivered" }
];
export const routes = [
  { name: "Главная", path: "/", icon: "el-icon-s-home", origin: "/" },
  {
    name: "Заказы",
    path: "/orders",
    icon: "el-icon-shopping-cart-full",
    hidden: true
  },
  { name: "Онлайн заказы", path: "/online", origin: "/orders/online" },
  { name: "Каталог", path: "/menu", icon: "el-icon-document", hidden: true },
  { name: "Товары", path: "/products", origin: "/menu/products" },
  {
    name: "Категории товаров",
    path: "/categories",
    origin: "/menu/categories"
  },
  { name: "Бренды", path: "/brands", origin: "/menu/brands" },
  { name: "Склад", path: "/storage", icon: "el-icon-receiving", hidden: true },
  { name: "Поставки", path: "/supply", origin: "/storage/supply" },
  { name: "Поставщики", path: "/suppliers", origin: "/storage/suppliers" },
  { name: "Склады", path: "/store", origin: "/storage/suppliers" },
  { name: "Остатки", path: "/calculation" },
  {
    name: "Доступ",
    path: "/access",
    icon: "el-icon-unlock",
    origin: "/access"
  },
  {
    name: "Курьеры",
    path: "/delivers",
    icon: "el-icon-s-promotion",
    origin: "/delivers"
  },
  { name: "Отчеты", path: "/reports",  hidden: true },
  { name: "Отчет по продуктам", path: "/product-reports", origin: "/reports/product-reports" },
  { name: "Клиенты", path: "/users", icon: "el-icon-user-solid", hidden: true },
  { name: "Все клиенты", path: "/all_users", origin: "/users/all_users" },
  { name: "Активные Клиенты", path: "/active", origin: "/users/active" },
  {
    name: "Отправка сообщение",
    path: "/send_message",
    icon: "el-icon-s-promotion",
    origin: "/send_message"
  },
  {
    name: "Категории",
    path: "/shop_category",
    origin: "/manage_shop/shop_category"
  },
  {
    name: "Слайдер",
    path: "/shop_carousel",
    origin: "/manage_shop/shop_carousel"
  },
  { name: "Доставление заказы", path: "/delivered", origin: "/delivered" },
  { name: "Отмененные заказы", path: "/canceled", origin: "/canceled" },
  //
  { name: "Новый бренд", path: "/brands_form" },
  { name: "Новая категория", path: "/categories_form" },
  { name: "Новый товар", path: "/products_form" },
  { name: "Новый товар", path: "/products_form" },
  { name: "Редактирование склада", path: "/store_form" },
  { name: "Добавление", path: "/suppliers_form" },
  { name: "Добавление", path: "/access_form" },
  { name: "Поставка", path: "/supply_form" },
  { name: "Добавление сообщения", path: "/message_form" }
];

export const sortlinks = [
  { path: "/" },
  { path: "/orders" },
  { path: "/menu" },
  { path: "/storage" },
  { path: "/delivers" },
  { path: "/users" },
  { path: "/reports" },
  { path: "/send_message" },
  { path: "/access" }
];
export const hiddenChildren = [
  "categories_form",
  "products_form",
  "suppliers_form",
  "store_form",
  "supply_form",
  "access_form",
  "brands_form",
  "carousel_form",
  "shop_category_form"
];
