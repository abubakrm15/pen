const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.body.classList.add("no-scroll");
setTimeout(() => {
    $("#intro").remove();
    document.body.classList.remove("no-scroll");
}, 3400);

$("#themeBtn").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

window.addEventListener("scroll", () => {
    $("#header").classList.toggle("header--scrolled", scrollY > 10);
});

$("#burger").addEventListener("click", () => {
    $("#burger").classList.toggle("burger--open");
    $("#nav").classList.toggle("nav--open");
});

$$(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
        $$(".nav__link").forEach((l) => l.classList.remove("nav__link--active"));
        link.classList.add("nav__link--active");
        $("#burger").classList.remove("burger--open");
        $("#nav").classList.remove("nav--open");
    });
});

$("#searchBtn").addEventListener("click", () => {
    $("#collection").scrollIntoView({ behavior: "smooth" });
});

function showToast(text) {
    $("#toast").textContent = text;
    $("#toast").classList.add("toast--show");
    setTimeout(() => $("#toast").classList.remove("toast--show"), 2500);
}

$$(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
        $$(".filter").forEach((f) => f.classList.remove("filter--active"));
        btn.classList.add("filter--active");
        $$(".product").forEach((p) => {
            const show = btn.dataset.filter === "all" || p.dataset.category === btn.dataset.filter;
            p.classList.toggle("product--hidden", !show);
        });
    });
});

$$(".product__fav").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("product__fav--active"));
});

let cart = [];

const price = (n) => n.toLocaleString("ru-RU") + " so'm";

function openCart() {
    $("#cart").classList.add("cart--open");
    $("#cartOverlay").classList.add("overlay--show");
}

function closeCart() {
    $("#cart").classList.remove("cart--open");
    $("#cartOverlay").classList.remove("overlay--show");
}

function renderCart() {
    let count = 0;
    let total = 0;

    $("#cartList").innerHTML = cart.map((item, i) => {
        count += item.qty;
        total += item.price * item.qty;
        return `
            <li class="cart__item">
                <img class="cart__item-img" src="${item.img}" alt="${item.name}">
                <div>
                    <h4 class="cart__item-name">${item.name}</h4>
                    <span class="cart__item-price">${price(item.price * item.qty)}</span>
                </div>
                <div class="cart__item-side">
                    <div class="qty">
                        <button class="qty__btn" onclick="changeQty(${i}, -1)">−</button>
                        <span class="qty__value">${item.qty}</span>
                        <button class="qty__btn" onclick="changeQty(${i}, 1)">+</button>
                    </div>
                    <button class="cart__remove" onclick="changeQty(${i}, -${item.qty})">O'chirish</button>
                </div>
            </li>`;
    }).join("");

    $("#cartCount").textContent = count;
    $("#cartSubtitle").textContent = count + " ta mahsulot";
    $("#cartSubtotal").textContent = price(total);
    $("#cartTotal").textContent = price(total);
    $("#cart").classList.toggle("cart--empty", cart.length === 0);
}

function changeQty(i, step) {
    cart[i].qty += step;
    if (cart[i].qty < 1) cart.splice(i, 1);
    renderCart();
}

$$(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const p = btn.closest(".product");
        const item = cart.find((c) => c.id === p.dataset.id);

        if (item) {
            item.qty++;
        } else {
            cart.push({
                id: p.dataset.id,
                name: p.querySelector(".product__name").textContent,
                price: +p.querySelector(".product__price").dataset.price,
                img: p.querySelector(".product__img").src,
                qty: 1,
            });
        }

        renderCart();
        openCart();
    });
});

$("#cartBtn").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
$("#cartBrowse").addEventListener("click", closeCart);

$("#cartCheckout").addEventListener("click", () => {
    cart = [];
    renderCart();
    closeCart();
    showToast("Buyurtma qabul qilindi");
});

renderCart();

let current = 0;

function showReview(i) {
    current = (i + $$(".review").length) % $$(".review").length;
    $$(".review").forEach((r, n) => r.classList.toggle("review--active", n === current));
    $$(".dot").forEach((d, n) => d.classList.toggle("dot--active", n === current));
}

$("#prevReview").addEventListener("click", () => showReview(current - 1));
$("#nextReview").addEventListener("click", () => showReview(current + 1));
$$(".dot").forEach((dot, i) => dot.addEventListener("click", () => showReview(i)));
setInterval(() => showReview(current + 1), 6000);

$("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("Obuna bo'ldingiz");
});
