export default class View {
  #btnInit = document.querySelector('#init');
  #statusOutput = document.querySelector('#status');
  #videoElement = document.querySelector('#video');

  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true });

  getVideoFrame(video) {
    const { videoHeight: height, videoWidth: width } = video;

    const canvas = this.#videoFrameCanvas;
    canvas.height = height;
    canvas.width = width;

    this.#canvasContext.drawImage(video, 0, 0, width, height);
    return this.#canvasContext.getImageData(0, 0, width, height);
  }

  enableButton() {
    this.#btnInit.disabled = false;
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener('click', fn);
  }

  log(text) {
    this.#statusOutput.innerHTML = text;
  }

  toogleVideoStatus() {
    if (this.#videoElement.paused) {
      this.#videoElement.play();
    } else {
      this.#videoElement.pause();
    }
  }
}