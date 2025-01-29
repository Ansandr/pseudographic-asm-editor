import Matrix from "./matrix";

const symbols = {
  0: 32,  // пробел
  1: 176, // ░
  2: 219  // █
};

function makeCodeArray(data, width = 16) {
  let asmCode = '';
  for (let i = 0; i < data.length; i += width) {
    let row = data.slice(i, i + width);
    let asmRow = 'db ';
    let currentSymbol = row[0];
    let count = 1;

    for (let j = 1; j < row.length; j++) {
      if (row[j] === currentSymbol) {
        count ++;
      } else {
        asmRow += `${count} dup(${symbols[currentSymbol]}), `;
        currentSymbol = row[j];
        count = 1;
      }
    }
    asmRow += `${count} dup(${symbols[currentSymbol]}), `;
    asmCode += asmRow + '10, 13\n'; // Добавить символы перевода строки (LF) и возврака каретки (CR)
  }

  return asmCode;
}

/**
 * 
 * @param {Matrix} matrix
 * @param {*} type 
 * @param {*} name 
 * @returns 
 */
export function makeCode(m) {
  let data = m.matrix;

  let code = `Symbol `;
  code += makeCodeArray(data, 16);
  code += '\n';
  
  return {code: code};
}