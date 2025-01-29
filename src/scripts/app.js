import { Component } from '@alexgyver/component';

import Matrix from './matrix';
import CanvasMatrix from './canvas';

let canvas = new CanvasMatrix(); // для роботи з canvas та зображеням
let editor = new Matrix(); // Клас для редагування зображення

/**
 * @function resize_h
 * @description Initial install size of canvas and matrices.
 */
function resize_h() {
  let wh = [16, 16];
  canvas.resize(wh[0], wh[1]);
  editor.resize(wh[0], wh[1]);

  render();
}

function render() {
  canvas.merge(editor); // Присвоить матрицу редактора = матрица холста
  canvas.render();
  //process(); // TODO создание кода преобразования
}

// ============== EDITOR ==============
// Логика для переключение цветов
function btn_to_color(current) {
  switch (current) {
    case 0:
      return 1
      break;
    case 1:
      return 2
      break;
    case 2:
      return 0
      break;
  }
}

function click_h(v, current) {
  console.log(`${v.x} ${v.y}, current: ${current}`)
  editor.set(v.x, v.y, btn_to_color(current));
  render();
}

document.addEventListener("DOMContentLoaded", () => {

  let ctx = {};
  Component.make('div', {
    class: 'cv_cont',
    context: ctx,
    parent: document.body,
    children: [
      {
        tag: 'div',
        class: 'cv_inner',
        children: [
          {
            tag: 'canvas',
            class: 'canvas',
            var: 'cv'
          }
        ]
      }
    ]
  });

  canvas = new CanvasMatrix(ctx.$cv, click_h);

  // Первичный вызов resize_h(): Устанавливаются начальные размеры canvas и матрицы.
  resize_h();
});