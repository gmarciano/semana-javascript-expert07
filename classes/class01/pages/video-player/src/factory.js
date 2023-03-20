import { supportsWorkerType } from '../../../lib/shared/util.js';
import Camera from '../../../lib/shared/camera.js';
import Controller from './controller.js';
import Service from './service.js';
import View from './view.js';

async function getWorker() {
  if (supportsWorkerType()) {
    console.log('initializing esm workers');
    return new Worker('./src/worker.js', { type: 'module' });
  }

  console.warn('Browser does not support esm modules on webworkers');
  console.warn('Importing tf modules');

  await import('https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js');
  await import('https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js');
  await import('https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js');
  await import('https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js');

  console.warn('Using worker mock instead');

  const service = new Service({ faceLandmarksDetection: window.faceLandmarksDetection });

  const workerMock = {
    async postMessage(video) {
      const blinked = await service.userBlinked(video);

      if (blinked) workerMock({ blinked });
    },
    // will be overwritten by controller
    onmessage(_) {},
  };

  await service.loadModel();

  setTimeout(() => {
    worker.onmessage({ data: 'ready' });
  }, 500);

  return workerMock;
}

const worker = await getWorker();
const camera = await Camera.init();

const factory = {
  initialize() {
    return Controller.initialize({
      view: new View(),
      camera,
      worker,
    });
  },
};

export default factory;