describe('Kiểm tra Giỏ hàng & Thanh toán - Saucedemo', () => {
  // Đăng nhập trước mỗi test để tiết kiệm thời gian
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
  });

  it('Thêm sản phẩm vào giỏ hàng', () => {
    // Thêm sản phẩm đầu tiên
    cy.get('.inventory_item').first()
      .find('button[data-test^="add-to-cart"]')  // selector ổn định hơn
      .click();

    // Kiểm tra badge giỏ hàng hiển thị số 1
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('Sắp xếp sản phẩm theo giá tăng dần (low to high)', () => {
    cy.get('.product_sort_container').select('lohi');

    // Sản phẩm đầu tiên phải là rẻ nhất ($7.99)
    cy.get('.inventory_item_price').first()
      .should('have.text', '$7.99');
  });

  it('Xóa sản phẩm khỏi giỏ hàng', () => {
  // Bước 1: Thêm 1 sản phẩm để có gì đó xóa
  cy.get('.inventory_item').first()
    .find('button:contains("Add to cart")')   // hoặc dùng [data-test^="add-to-cart-"] nếu muốn chính xác hơn
    .click();

  // Bước 2: Vào trang giỏ hàng
  cy.get('.shopping_cart_link').click();

  // Bước 3: Xóa sản phẩm (nút Remove trên trang cart)
  cy.get('button:contains("Remove")')          // hoặc [data-test^="remove-"]
    .should('be.visible')
    .click();

  // Bước 4: Kiểm tra giỏ hàng trống
  cy.get('.shopping_cart_badge').should('not.exist');          // Badge số lượng biến mất

  // Assertion chính xác: Không còn item sản phẩm nào
  cy.get('.cart_list .cart_item').should('not.exist');         // ← Đây là cách tốt nhất

  // Optional: Thêm kiểm tra để chắc chắn hơn
  cy.get('.cart_list').should('be.visible');                   // Phần list vẫn tồn tại
  cy.get('button[data-test="continue-shopping"]').should('be.visible'); // Nút Continue Shopping vẫn có
  cy.get('#checkout').should('be.visible');                    // Nút Checkout vẫn hiển thị
});

  it('Thực hiện quy trình thanh toán đến bước xác nhận', () => {
    // Thêm sản phẩm
    cy.get('.inventory_item').first()
      .find('button[data-test^="add-to-cart"]')
      .click();

    // Vào giỏ hàng → Checkout
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();

    // Điền thông tin
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.get('#postal-code').type('12345');

    // Tiếp tục
    cy.get('#continue').click();

    // Kiểm tra đến trang xác nhận (step two)
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.title').should('have.text', 'Checkout: Overview');
  });
});