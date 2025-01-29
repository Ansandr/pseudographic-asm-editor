/**
 * @class Matrix
 * @description A class representing a 2D matrix of integers.
 */
export default class Matrix {
  
  matrix = new Int32Array();
  W = 0;
  H = 0;

  constructor(w, h) {
    this.resize(w, h);
  }

  resize(w, h) {
    if (w && h) {
        this.W = w;
        this.H = h;
        this.matrix = new Int32Array(w * h).fill(0); // Initialize the matrix with zeros
    }
  }

  merge(mx) {
    if (this.matrix.length != mx.matrix.length) return;
    for (let i = 0; i < this.matrix.length; i++) {
        let v = mx.matrix[i];
        this.matrix[i] = v;
    }
  }

  /**
  * @function set
  * @param {number} x 
  * @param {number} y 
  * @param {number} v - The new value of the element. 
  */
  set(x, y, v) {
    this.matrix[y * this.W + x] = v;
  }

  /**
   * @function get
   * @param {number} x 
   * @param {number} y 
   * @return {number} The value of the element at the specified coordinates.
   */
  get(x, y) {
    return this.matrix[y * this.W + x];
  }

  /**
   * @function clear
   * @description Clears the matrix by setting all elements to zero.
   */
  clear() {
    this.matrix.fill(0);
  }
}