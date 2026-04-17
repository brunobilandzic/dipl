export const infiniteLoopDebug = (timeout = 1000 * 10) => {
  setTimeout(() => {
    throw new Error("Infinite loop prevent...");
  }, timeout);
};
