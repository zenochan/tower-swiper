export default function debounce(ctx, fn, wait = 16) {
  let timeoutHandler = null;
  return (...args) => {
    if (timeoutHandler) clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => fn.apply(ctx, args), wait);
  };
}
