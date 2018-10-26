App.Volume = {
  volumeBtn: document.querySelector('.volume'),
  mute: 0,
  attrs: ['#icon-volume', '#icon-mute'],

  init: function() {
    var that = this;
    that.volumeBtn.addEventListener('click', function() {
      that.toggleIcon()
      that.setVolume()
    });
  },

  setVolume: function() {
    
  },

  toggleIcon: function() {
      this.mute = this.mute ? 0 : 1;
      this.volumeBtn
        .querySelector('.volume-icon use')
        .setAttribute('xlink:href', this.attrs[this.mute]);
  }
}
