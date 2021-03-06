import debounce from '../utils/debounce';
import throttle from '../utils/throttle';

// eslint-disable-next-line no-undef
Component({
  options: {
    pureDataPattern: /^/,
  },
  properties: {
    active: { type: Number, value: 0 },
  },
  data: {},
  methods: {
    init() {
      const items = this.getRelationNodes('../tower-swiper-item/index');
      this.setData({ items });

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
      const index = this.data.items.indexOf(target);
      if (index !== this.data.active) {
        this.setData({ active: index });
        this.mount();
      }
    },

    mount() {
      const { items, active } = this.data;
      const l = items.length;
      const odd = l % 2;
      const half = Math.floor(items.length / 2);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < items.length; i++) {
        const item = items[(half + active + i + odd) % l];
        const zIndex = half - Math.abs(half - i) + odd;
        item.setZIndex(zIndex);
        item.setLeft(i - half);
        item.setScale(1 - (half - zIndex) / 10);
      }
    },
    swiper(isLeft) {
      const offset = isLeft ? -1 : 1;
      const { items, active } = this.data;
      this.setData({ active: (active + offset + items.length) % items.length });
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
