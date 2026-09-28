function interceptTimeout(
  method: 'setTimeout' | 'setInterval',
  checkProp: '$$unionKeyDisabledSetTimeout' | '$$unionKeyDisabledSetInterval',
) {
  const methodOld = global[method];

  // @ts-ignore
  global[method] = function (
    fn: (...args: any[]) => any,
    timeout: number | undefined,
  ) {
    return methodOld(() => {
      if (global[checkProp]) {
        console.error(`${method} is disabled`);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn();
    }, timeout);
  };
}

function interceptTimerWithDisable() {
  try {
    interceptTimeout('setTimeout', '$$unionKeyDisabledSetTimeout');
  } catch (error) {
    console.error(error);
  }
  try {
    interceptTimeout('setInterval', '$$unionKeyDisabledSetInterval');
  } catch (error) {
    console.error(error);
  }
}

function enableSetTimeout() {
  global.$$unionKeyDisabledSetTimeout = undefined;
}

function disableSetTimeout() {
  global.$$unionKeyDisabledSetTimeout = true;
}

function enableSetInterval() {
  global.$$unionKeyDisabledSetInterval = undefined;
}

function disableSetInterval() {
  global.$$unionKeyDisabledSetInterval = true;
}

export default {
  interceptTimerWithDisable,
  enableSetTimeout,
  disableSetTimeout,
  enableSetInterval,
  disableSetInterval,
};
