# [Tower Swiper](https://github.com/zenochan/tower-swiper)
> 微信小程序「Tower Swiper」组件, [小程序代码片段](https://developers.weixin.qq.com/s/SGGfa2mt7GmC)

# Preview
![](http://etc.izeno.morma.cn/ipic/2020-11-22-tower_swiper.gif)

#Arithmetic

## api
#### css
`position`, `z-index`, `margin-left`, `transform`, `transition`, `opacity`

#### js
`throttle`, `debounce`,    `wx.createSelectorQuery`(通过 child 计算容器高度)

#### wxml/html
`touchstart`, `touchmove`, `touchend`

## step by step
1. `tower-swiper` 设置 `position: relative`
2. `tower-swiper-item` 使用绝对布局 `position:absolute` 使其再parent中水平居中的位置
3. `tower-swiper-item` 通过 `transform:translateX()` 实现水平(同样可以使用`margin-left`,这里为了偏移量为自身宽度百分比，便使用了 `translateX`)
4. `tower-swiper-item` 通过 `transform:scale()` 实现尺寸层次感
5. `tower-swiper-item` 通过 `z-index` 实现堆叠效果，中间至两端的元素，`z-index`递减
6. `tower-swiper-item` 通过 `transition` 实现过渡效果
7. <font color=red>画重点</font>: 通过 `js` 计算 `z-index`, `left` 偏移量
    > z-index 从中间往两端依次降低，left偏移量中间为0， 左端为负值，右端为正值
8. 通过`touchstart`, `touchmove`, `touchend` 处理手势交互
9. 性能优化： 通过 `throttle`, `debounce` 过滤一些不必要的高频事件

#### `tower-swiper-item` 整体样式
```css
.tower-swiper-item {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(calc(-50% + var(--left) * 20%));
    z-index: var(--z-index);
    transition: all ease 0.5s;
}

.tower-swiper-item--hidden {
    opacity: 0;
}

.tower-swiper-item__scale {
    transform: scale(var(--scale));
    transition: all ease 0.5s;
}
```

#### 计算 `z-index`, `left`
```js
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
```

通过设置 active 改变中间显示的 item

# Usage
```json
{
  "usingComponents": {
    "tower-swiper": "/lib/tower-swiper/index",
    "tower-swiper-item": "/lib/tower-swiper-item/index"
  }
}
```

```xml
<tower-swiper class="tower-swiper">
  <tower-swiper-item wx:for="{{items}}" wx:key="id">
    <image class="item" src="{{item.url}}" mode="aspectFill"></image>
  </tower-swiper-item>
</tower-swiper>
```

```js
Page({
  data: {
    items: [
      { id: 0, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg' },
      { id: 1, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg' },
      { id: 2, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg' },
      { id: 3, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' },
      { id: 4, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg' },
      { id: 5, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg' },
      { id: 6, type: 'image', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg' },
    ],
  },
});
```

# References
- [weilanwl/ColorUI](https://github.com/weilanwl/ColorUI)
    > ![](https://www.color-ui.com/index.png)

# License
[MIT](https://github.com/zenochan/tower-swiper/blob/master/LICENSE)
