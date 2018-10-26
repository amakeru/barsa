var App = App || {
  init: function() {

    App.Volume.init();
    App.Sidebar.init();

  }
};

document.addEventListener('DOMContentLoaded', function() {
  App.init();
})
