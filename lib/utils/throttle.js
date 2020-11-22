export default function throttle(ctx, fn, delay = 500) {
  let active = false;
  return (...args) => {
    if (active) {
      return;
    }
    active = true;
    fn.apply(ctx, args);
    setTimeout(() => { active = false; }, delay);
  };
}
