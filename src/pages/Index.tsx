import { useState } from "react";
import Icon from "@/components/ui/icon";
import SubwayGame from "@/components/SubwayGame";

const PRODUCTS = [
  {
    id: 1,
    name: "Изделие № 01",
    price: "4 200 ₽",
    category: "Коллекция",
    image: "https://cdn.poehali.dev/projects/83a91298-9f46-4aea-9a3d-5943a167e02f/files/6d44e9ec-b004-4be0-acc4-f7a16b097845.jpg",
  },
  {
    id: 2,
    name: "Изделие № 02",
    price: "6 800 ₽",
    category: "Коллекция",
    image: "https://cdn.poehali.dev/projects/83a91298-9f46-4aea-9a3d-5943a167e02f/files/6d44e9ec-b004-4be0-acc4-f7a16b097845.jpg",
  },
  {
    id: 3,
    name: "Изделие № 03",
    price: "3 500 ₽",
    category: "Коллекция",
    image: "https://cdn.poehali.dev/projects/83a91298-9f46-4aea-9a3d-5943a167e02f/files/6d44e9ec-b004-4be0-acc4-f7a16b097845.jpg",
  },
  {
    id: 4,
    name: "Изделие № 04",
    price: "9 100 ₽",
    category: "Коллекция",
    image: "https://cdn.poehali.dev/projects/83a91298-9f46-4aea-9a3d-5943a167e02f/files/6d44e9ec-b004-4be0-acc4-f7a16b097845.jpg",
  },
];

const PAYMENT_METHODS = [
  { icon: "CreditCard", title: "Банковская карта", desc: "Visa, Mastercard, МИР — мгновенное подтверждение" },
  { icon: "Smartphone", title: "СБП", desc: "Система быстрых платежей — перевод по QR-коду" },
  { icon: "Landmark", title: "Банковский перевод", desc: "Для юридических лиц — счёт на оплату" },
  { icon: "Wallet", title: "Электронные кошельки", desc: "ЮMoney, QIWI и другие сервисы" },
];

type Section = "shop" | "payment" | "contacts" | "game";

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>("shop");
  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAddToCart = (id: number) => {
    setCartCount((c) => c + 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const navItems: { key: Section; label: string }[] = [
    { key: "shop", label: "Каталог" },
    { key: "payment", label: "Оплата" },
    { key: "contacts", label: "Контакты" },
    { key: "game", label: "Игра" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setActiveSection("shop")}
            className="font-display text-xl tracking-widest uppercase"
          >
            Магазин
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`font-body text-sm tracking-wider uppercase line-hover transition-colors ${
                  activeSection === key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection("shop")}
              className="relative flex items-center gap-1.5 font-body text-sm"
            >
              <Icon name="ShoppingBag" size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveSection(key); setMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 font-body text-sm tracking-wider uppercase border-b border-border last:border-0 ${
                  activeSection === key ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="pt-16">
        {activeSection === "shop" && (
          <div>
            <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
              <img
                src="https://cdn.poehali.dev/projects/83a91298-9f46-4aea-9a3d-5943a167e02f/files/6d44e9ec-b004-4be0-acc4-f7a16b097845.jpg"
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 animate-fade-up">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Новая коллекция
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-light leading-none mb-6">
                  Форма<br />
                  <span className="italic">и смысл</span>
                </h1>
                <button
                  onClick={() => {
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-3 font-body text-sm tracking-wider uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
                >
                  Смотреть каталог
                  <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            </section>

            <section id="products" className="max-w-6xl mx-auto px-6 py-24">
              <div className="flex items-baseline justify-between mb-16">
                <h2 className="font-display text-4xl font-light">Каталог</h2>
                <span className="font-body text-sm text-muted-foreground tracking-wider">
                  {PRODUCTS.length} позиции
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="bg-background group">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className={`absolute bottom-0 left-0 right-0 py-3 font-body text-xs tracking-widest uppercase text-center transition-all duration-300 ${
                          addedId === p.id
                            ? "bg-foreground text-background translate-y-0"
                            : "bg-background/90 text-foreground translate-y-full group-hover:translate-y-0"
                        }`}
                      >
                        {addedId === p.id ? "Добавлено ✓" : "В корзину"}
                      </button>
                    </div>
                    <div className="p-4 border-t border-border">
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        {p.category}
                      </p>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-display text-lg">{p.name}</h3>
                        <span className="font-body text-sm">{p.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-y border-border py-16 bg-secondary/30">
              <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                {[
                  { icon: "Package", title: "Доставка по России", desc: "3–7 рабочих дней" },
                  { icon: "RotateCcw", title: "Возврат 14 дней", desc: "Без лишних вопросов" },
                  { icon: "Shield", title: "Гарантия качества", desc: "Каждый товар проверен" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex flex-col items-center gap-3">
                    <Icon name={icon as "Package"} size={22} className="text-muted-foreground" />
                    <p className="font-display text-lg">{title}</p>
                    <p className="font-body text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === "payment" && (
          <section className="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
            <div className="mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Как оплатить
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light">
                Способы<br />
                <span className="italic">оплаты</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {PAYMENT_METHODS.map(({ icon, title, desc }) => (
                <div key={title} className="bg-background p-8 hover:bg-secondary/30 transition-colors duration-200">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={icon as "CreditCard"} size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl mb-2">{title}</h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 border border-border">
              <div className="flex items-start gap-5">
                <Icon name="Info" size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-xl mb-2">Безопасность платежей</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Все платежи обрабатываются по защищённому протоколу HTTPS.
                    Данные карты не хранятся на наших серверах.
                    Оплата проходит через сертифицированный платёжный шлюз.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setActiveSection("shop")}
                className="flex-1 py-4 border border-foreground font-body text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Перейти к покупкам
              </button>
              <button
                onClick={() => setActiveSection("contacts")}
                className="flex-1 py-4 border border-border font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors duration-300"
              >
                Задать вопрос
              </button>
            </div>
          </section>
        )}

        {activeSection === "game" && (
          <section className="max-w-4xl mx-auto px-6 py-16 animate-fade-in">
            <div className="mb-10">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Мини-игра
              </p>
              <h2 className="font-display text-5xl font-light">
                Subway <span className="italic">Run</span>
              </h2>
            </div>
            <SubwayGame />
          </section>
        )}

        {activeSection === "contacts" && (
          <section className="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
            <div className="mb-16">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Связаться с нами
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light">
                Контакты
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                {[
                  { icon: "Mail", label: "Почта", value: "hello@magazin.ru" },
                  { icon: "Phone", label: "Телефон", value: "+7 (000) 000-00-00" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Примерная, 1" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт, 9:00–18:00" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                      <Icon name={icon as "Mail"} size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        {label}
                      </p>
                      <p className="font-display text-xl">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-display text-2xl mb-8">Написать нам</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                      Сообщение
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ваш вопрос или сообщение..."
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-200 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:opacity-80 transition-opacity duration-200"
                  >
                    Отправить
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg tracking-widest uppercase">Магазин</p>
          <div className="flex items-center gap-8">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className="font-body text-xs tracking-wider uppercase text-muted-foreground line-hover hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground">© 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;