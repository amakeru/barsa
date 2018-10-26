App.Sidebar = {
  sidebar: document.querySelector('.sidebar'),
  closeBtn: document.querySelector('.nav__hide'),
  openBtn: document.querySelector('.menu-open'),
  openClass: 'open',

  init: function() {
    var that = this;
    this.closeBtn.addEventListener('click', function() {
      that.close();
    });
    this.openBtn.addEventListener('click', function() {
      that.open();
    });
  },

  open: function() {
    this.sidebar.classList.add(this.openClass);
  },

  close: function() {
    this.sidebar.classList.remove(this.openClass);
  }
};
