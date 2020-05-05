class Product {
  /**
   * Product blueprint - how an object (product object)
   * created based on Product class should look like
   * @param {string} title Title of product
   * @param {string} image A Product image
   * @param {number} price A Product price
   * @param {string} description A Product description
   */
  constructor(title, image, price, description) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.description = description;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

/**
 * Inheritance class
 * Will be a class to output different parts of web page (components)
 */
class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  /**
   * @param {string} tag The tag of the element I want to create
   * @param {string} cssClasses Css classes
   * @param {string} attributes Other attributes that might need to be added
   */
  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);

    if (cssClasses) {
      rootElement.className = cssClasses;
    }

    if (attributes && attributes.length > 0) {
      for (const attribute of attributes) {
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);

    return rootElement;
  }
}

// Shopping Cart
class ShoppingCart extends Component {
  // Initially shopping cart is empty
  items = [];

  // Setter
  set cartItems(product) {
    this.items = product;
    this.totalOutput.innerHTML = `
      <h2>Total: \&#8364; ${this.totalAmount.toFixed(2)}</h2>
    `;
  }

  // Getter
  get totalAmount() {
    const sum = this.items.reduce(
      (previousValue, currentProduct) => previousValue + currentProduct.price,
      0
    );
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId);
  }

  addProduct(product) {
    // Update shopping cart with new product and with total amount (sum)
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  // Order products
  orderProducts() {
    console.log('Ordering ', this.items);
  }

  // Total amount and order items logic
  render() {
    const cartElement = this.createRootElement('section', 'cart');
    cartElement.innerHTML = `
      <h2>Total: \&#8364; ${0}</h2>
      <button>Order Now</button>
    `;
    const orderBtn = cartElement.querySelector('button');

    // orderBtn.addEventListener('click', () => this.orderProducts());
    orderBtn.addEventListener('click', this.orderProducts.bind(this));
    this.totalOutput = cartElement.querySelector('h2');
  }
}

// Single product item
class ProductItem extends Component {
  /**
   * @param {object} product Product properties that make up a product,
   * basically what I already have defined, and based on that I will
   * accept the overall product object property structure
   */
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  // Logic for adding a single product to a Cart
  addToCart() {
    App.addProductToCart(this.product);
  }

  // Logic for rendering a single product element
  render() {
    const productElement = this.createRootElement('li', 'product-item');

    productElement.innerHTML = `
        <div>
          <img src="${this.product.image}" alt="${this.product.title}">
          <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\&#8364; ${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to Cart</button>
          </div>  
        </div>  
      `;

    // "Add to Cart" button responsible for a single product
    const addToCartBtn = productElement.querySelector('button');

    addToCartBtn.addEventListener('click', this.addToCart.bind(this));
  }
}

// List of all products
class ProductList extends Component {
  // Products array initially will be empty
  products = [];

  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  // Simulate fetching products from database
  fetchProducts() {
    this.products = [
      new Product(
        'A Product 1',
        'https://dummyimage.com/800x320/a89fa8/540075&text=A+Product+Image+1',
        34.95,
        'Description of Product 1'
      ),
      new Product(
        'A Product 2',
        'https://dummyimage.com/800x320/a89fa8/540075&text=A+Product+Image+2',
        83.75,
        'Description of Product 2'
      )
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const product of this.products) {
      new ProductItem(product, 'prod-list');
    }
  }

  // Logic for rendering list of products on the page
  render() {
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list')
    ]);

    if (this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}

// Combine ShoppingCart and ProductList
class Shop {
  constructor() {
    this.render();
  }

  render() {
    // ShoppingCart instantiation as a property of Shop class
    this.cart = new ShoppingCart('app');

    // ProductList instantiation
    new ProductList('app');
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

// Execute init method directly on App class itself
App.init();
