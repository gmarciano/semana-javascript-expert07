function prepareRunChecker({ timeDelay }) {
  let lastEvent = Date.now();

  return {
    shouldRun() {
      const result = (Date.now() - lastEvent) > timeDelay;

      if (result) {
        lastEvent = Date.now();
      }

      return result;
    },
  };
}

function supportsWorkerType() {
  let supported = false;

  const tester = {
    get type() {
      supported = true;
    },
  };

  try {
    new Worker('blob://', tester).terminate();
  } finally {
    return supported;
  }
}

export {
  prepareRunChecker,
  supportsWorkerType,
};