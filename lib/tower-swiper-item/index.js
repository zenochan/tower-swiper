// eslint-disable-next-line no-undef
Component({
  properties: {},
  data: {
    zIndex: 0,
    left: 0,
    scale: 1,
  },
  methods: {
    onTap() {
      this.parent.onTapItem(this);
    },
    setZIndex(zIndex) {
      if (zIndex !== this.data.zIndex) {
        // setTimeout(() => this.setData({ zIndex }), 250);
        this.setData({ zIndex });
      }
    },
    setLeft(left) {
      this.setData({ left });
    },
    setScale(scale) {
      if (scale !== this.data.scale) {
        this.setData({ scale });
      }
    },
  },
  relations: {
    '../tower-swiper/index': {
      type: 'parent',
      linked(target) {
        this.parent = target;
      },
      linkChanged(target) {
        this.parent = target;
      },
      unlinked() {
        this.parent = null;
      },
    },
  },
});
