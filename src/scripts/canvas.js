import Matrix from "./matrix";

/**
 * @class CanvasMatrix
 * @extends Matrix
 * @description Matrix with the ability to draw on it
 */
export default class CanvasMatrix extends Matrix {

  /**
     * @constructor
     * @param {HTMLCanvasElement} cv The canvas element on which the matrix will be displayed.
     * @param {function} onclick The mouse click event handler function.
     */
  constructor(cv, onclick) {
    super();

    if (!cv) return;
    
    this.cv = cv;
    this.cx = cv.getContext("2d"); // Context for drawing

    this._onclick = onclick; // click handler

    // event handler
    cv.addEventListener("mousedown", e => this._onMouseDown(e)); // canvas click event handler
    document.addEventListener("mouseup", e => this._onMouseUp(e)); // Отпускание кнопки мыши
  }

  resize(w, h) {
    super.resize(w, h);
    this._resize();
  }

  /**
   * @function render
   * @description Renders the matrix on the canvas
   */
  render() {
    // Заповнити матрицю кольором black
    this.cx.fillRect(0, 0, this.cv.width, this.cv.height);
    
    let b = this._blocksize;
    
    // Циклічно пройтись по всім елементам матриці
    // Для кожного елемента встановити колір заливки
    for (let x = 0; x < this.W; x++) {
      for (let y = 0; y < this.H; y++) {
        let v = this.get(x, y);
        
        // Логика покраски
        switch (v) {
          case 0:
            this.cx.fillStyle = this.black;
            break;
          case 1:
            this.cx.fillStyle = this.gray;
            break;
          case 2:
            this.cx.fillStyle = this.white;
        }

        // Малюєм прямокутник, який, який відповідає елементу матриці
        this.cx.fillRect(x * b, y * b, b, b);
          
        // Малюєм сітку
        this.cx.strokeRect(x * b, y * b, b, b);
      }
    }
  }

  _resize() {
    if (!this.cv) return;

    // Обчислити розмір елементу (this._blocksize)
    let w = this.cv.parentNode.clientWidth;
    w = Math.floor(w / this.W) * this.W;
    if (!w) w = this.W;
    let h = w * this.H / this.W;
    this._blocksize = w /this.W;

    // Встановитии розмір canvas
    this.cv.width = w;
    this.cv.height = h;

    // Розрахунок ширини лінії для блоків.
    this.cx.lineWidth = this._blocksize / 64;
    
    // Корректирует размеры для _maxwidth.
    w = this.cv.parentNode.clientWidth;
    h = w * this.H / this.W;
    if (h > this._maxwidth) {
        h = this._maxwidth;
        w = h * this.W / this.H;
    }

    // Устанавливает _realW и _realH — реальные размеры canvas, отображаемые на странице.
    this._realW = w;
    this._realH = h;
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';

    this.render();
  }

  _blocksize = 0; // Размер блока
  _pressed = false; // Флаг, отвечающий за то, что кнопка мыши зажата
  _pressXY = []; // Координаты нажатия мыши

  black = '#000000';
  white = '#ffffff';
  gray = "#808080"

  _realW = 0; // Реальная ширина canvas
  _realH = 0; // Реальная высота canvas

  _maxwidth = 800; // Максимальная ширина canvas

  /**
   * Обработчик нажатия кнопки мыши.
   * @param {MouseEvent} e - Объект события MouseEvent.
   * @private
   */
  _onMouseDown(e) {
    this._pressed = true;
    this._pressXY = this._getXY(e);
  }

  /**
   * Обработчик отпускания кнопки мыши.
   * @param {MouseEvent} e - Объект события MouseEvent.
   * @private
   */
  _onMouseUp(e) {
    if (!this._pressed) return; // Если кнопка не была нажата, выход

    this._pressed = false; // Сбрасываем флаг нажатия
    let cord = this._getXY(e); // Получаем текущие координаты мыши
    
    let blockCord = this._blockXY(cord);
    let color = this.get(blockCord.x, blockCord.y);


    this._onclick(blockCord, color);
  }
  
  /**
   * @private
   * @param {MouseEvent} e 
   * @returns {object} the mouse coordinates relative to Canvas.
   */
  _getXY(e) {
    let x = e.pageX;
    let y = e.pageY;

    // Вычитаем смещение canvas относительно родительского элемента
    if (this.cv.offsetParent.tagName.toUpperCase() == "BODY") {
      x -= this.cv.offsetLeft;
      y -= this.cv.offsetTop;
    } else {
      x -= this.cv.offsetParent.offsetLeft;
      y -= this.cv.offsetParent.offsetTop;
    }

    // Масштабируем координаты под размер canvas
    x *= this.cv.width / this._realW;
    y *= this.cv.height / this._realH;

    return { x: x, y: y };
  }

  /**
   * Преобразования координат мыши на холсте (canvas) в координаты ячейки (блока) в матрице данных.
   * @param {object} xy - Координаты
   * @returns {object} Координаты блока
   */
  _blockXY(xy) {
    return {
      x: Math.floor(xy.x / this.cv.width * this.W),
      y: Math.floor(xy.y / this.cv.height * this.H) 
    };
}
}