import debounce from '../utils/debounce';
import throttle from '../utils/throttle';

// eslint-disable-next-line no-undef
Component({
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    _active: { type: Number, value: 0 },
  },
  data: {},
  methods: {
    init() {
      const items = this.getRelationNodes('../tower-swiper-item/index');
      this.setData({
        _items: items,
        _active: 0,
      });

      if (items.length > 0) {
        items[0].createSelectorQuery()
          .select('.tower-swiper-item')
          .boundingClientRect((result) => {
            this.setData({ height: result.height });
          }).exec();
        this.mount();
      }
    },

    onTapItem(target) {
      const index = this.data._items.indexOf(target);
      if (index !== this.data._active) {
        this.setData({ _active: index });
        this.mount();
      }
    },

    mount() {
      const { _items, _active } = this.data;
      const l = _items.length;
      const odd = l % 2;
      const half = Math.floor(_items.length / 2);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < _items.length; i++) {
        const item = _items[(half + _active + i + odd) % l];
        const zIndex = half - Math.abs(half - i) + odd;
        item.setZIndex(zIndex);
        item.setLeft(i - half);
        item.setScale(1 - (half - zIndex) / 10);
      }
    },
    swiper(isLeft) {
      const offset = isLeft ? -1 : 1;
      const { _items, _active } = this.data;
      this.setData({ _active: (_active + offset + _items.length) % _items.length });
      this.mount();
    },

    onTouchStart(e) {
      const touch = e.touches[0];
      this.touchStart = {
        timestamp: e.timeStamp,
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
    },

    onTouchMove(e) {
      const touch = e.touches[0];
      this.touchEnd = {
        timestamp: e.timeStamp,
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
    },
    onTouchEnd() {
      if (!this.touchStart || !this.touchEnd) { return; }

      const deltaX = this.touchStart.clientX - this.touchEnd.clientX;
      const deltaY = this.touchStart.clientY - this.touchEnd.clientY;
      if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
        this.swiper(deltaX < 0);
      }
      this.touchStart = null;
      this.touchEnd = null;
    },
  },
  relations: {
    '../tower-swiper-item/index': {
      type: 'child',
      linked() {
        this.init();
      },
      linkChanged() {
        this.init();
      },
      unlinked() {
        this.init();
      },
    },
  },
  lifetimes: {
    created() {
      this.init = debounce(this, this.init);
      this.onSwiper = throttle(this, this.onSwiper, 500);
      this.onTouchMove = throttle(this, this.onTouchMove, 16);
    },
  },
});
