import { Component } from '@alexgyver/component';

import Matrix from './matrix';
import CanvasMatrix from './canvas';

import * as proc from './processor'

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

function update_h() {
  render();
}

function render() {
  canvas.merge(editor); // Присвоить матрицу редактора = матрица холста
  canvas.render();
  process(); // TODO создание кода преобразования
}

function process() {
  let result = proc.makeCode(canvas);

  /** @type {HTMLTextAreaElement} */
  let textarea = document.getElementById('result_textarea');
  textarea.value = result.code;
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

function click_h(v, current_color) {
  editor.set(v.x, v.y, btn_to_color(current_color));
  update_h();
}

// ============== MOUSE ==============
function drag_h(v, current_color) {
  editor.set(v.block.x, v.block.y, btn_to_color(current_color));
  update_h();
}

// Начало программы
document.addEventListener("DOMContentLoaded", () => {

  let ctx = {};
  Component.make('div', {
    class: 'cv_cont',
    context: ctx,
    parent: document.getElementById('cv_root'),
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

  canvas = new CanvasMatrix(ctx.$cv, click_h, drag_h);

  // Первичный вызов resize_h(): Устанавливаются начальные размеры canvas и матрицы.
  resize_h();
});