export default class Controller {
  #camera;
  #view;
  #worker;

  #blinkCounter = 0;

  constructor({ camera, view, worker }) {
    this.#camera = camera;
    this.#view = view;
    this.#worker = this.#configureWorker(worker);

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
  }

  static initialize(dependencies) {
    const controller = new Controller(dependencies);
    controller.log('still need to enable blink recognition');
    return controller.init();
  }

  #configureWorker(worker) {
    let ready = false;

    worker.onmessage = ({ data }) => {
      // forces user to await until worker imports loaded before enableing blink recognition
      if (data === 'ready') {
        this.#view.enableButton();
        ready = true;
        return;
      }

      if (data.blinked) {
        this.#blinkCounter += 1;
        this.#view.toogleVideoStatus();
        return;
      }
    };

    return {
      send(msg) {
        if (ready) worker.postMessage(msg);
      },
    };
  }

  init() {
    console.log('init');
  }

  loop() {
    const { video } = this.#camera;
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log('detecting eye blink');

    setTimeout(() => this.loop(), 100);
  }

  log(text) {
    const times = `                  - blinked times: ${this.#blinkCounter}`;
    this.#view.log(`logger: ${text}`.concat(this.#blinkCounter > 0 ? times : ''));
  }

  onBtnStart() {
    this.log('initializing blink detection');
    this.#blinkCounter = 0;
    this.loop();
  }
}