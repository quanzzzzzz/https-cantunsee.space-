describe('Kiểm tra chức năng Đăng nhập - Saucedemo', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
  });

  it('Đăng nhập thành công với tài khoản hợp lệ', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // Kiểm tra chuyển trang inventory
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products'); // Tiêu đề trang sản phẩm
  });

  it('Hiển thị lỗi khi đăng nhập sai thông tin', () => {
    cy.get('#user-name').type('wrong_user');
    cy.get('#password').type('wrong_pass');
    cy.get('#login-button').click();

    // Kiểm tra thông báo lỗi
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match any user in this service');
  });
});