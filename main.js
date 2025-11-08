const form = document.getElementById("ferma-form");
const input = document.getElementById("number-input");
const resultOutput = document.getElementById("result-output");

function parseInputNumber(value) {
  if (value.length < 16) {
    const num = Number(value);
    if (Number.isInteger(num) && num > 2) {
      return num;
    }
  }

  const bigNum = BigInt(value);

  return bigNum;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resetCount();

  const value = input.value.trim();
  const n = parseInputNumber(value);

  factorizeFerma(n);
  rowOutputFifth(primeNumbers);

  document.querySelector(".result-section").hidden = false;
});

form.addEventListener("reset", (e) => {
  resultOutput.innerHTML = "";
  document.querySelector(".result-section").hidden = true;
});

const parametrs = [
  "k",
  "y",
  "<math><mroot><mi>y</mi><mn></mn> </mroot></math>",
];

let parametrsValue = [];
let primeNumbers = [];
let globalCount = 0;

function resetCount() {
  globalCount = 0;
}

function calculateS(n) {
  return [Math.sqrt(n), Math.ceil(Math.sqrt(n))];
}

function calculateBigIntS(n) {
  let guess = n;
  while (guess * guess > n) {
    guess = (guess + n / guess) / 2n;
  }
  return guess + 1n;
}

function factorizeFerma(n, depth = 0) {
  let s;
  parametrsValue = [];
  globalCount++;

  if (depth === 0) {
    resultOutput.innerHTML = "";
    primeNumbers = [];
  }

  if (typeof n !== "bigint") {
    s = calculateS(n);

    const rowOutput = document.createElement("div");
    rowOutput.classList.add("row-output");
    rowOutput.classList.add("big-font");
    rowOutput.innerHTML = `<strong>Шаг ${globalCount}: </strong>Разложим число n = ${n}`;
    resultOutput.appendChild(rowOutput);

    rowOutputFirst(n, s[0], s[1]);
    rowOutputSecond();

    let k = 0;

    while (true) {
      const x = s[1] + k;
      const y = x * x - n;
      const sqrtY = Math.sqrt(y);

      const arr = [k, y, sqrtY];
      parametrsValue.push(arr);

      if (Number.isInteger(sqrtY)) {
        const a = x + sqrtY;
        const b = x - sqrtY;

        rowOutputThird(parametrs, parametrsValue);
        rowOutputFourth(sqrtY, s[1], k, a, b);

        if (!isPrime(a)) {
          factorizeFerma(a, depth + 1);
        } else {
          primeNumbers.push(a);
        }

        if (!isPrime(b)) {
          factorizeFerma(b, depth + 1);
        } else {
          primeNumbers.push(b);
        }

        return;
      }

      if (k >= 1000) {
        rowOutputError(k);
        return;
      }

      k++;
    }
  } else {
    const s = calculateBigIntS(n);

    const rowOutput = document.createElement("div");
    rowOutput.classList.add("row-output");
    rowOutput.classList.add("big-font");
    rowOutput.innerHTML = `<strong>Шаг ${globalCount}: </strong>Разложим число n = ${n}`;
    resultOutput.appendChild(rowOutput);

    rowOutputFirstBigInt(n, s);
    rowOutputSecondBigInt();

    let k = 0n;

    while (true) {
      const x = s + k;
      const y = x * x - n;
      const sqrtY = sqrtBigInt(y);

      if (sqrtY !== null) {
        rowOutputBigIntResult(s, k, sqrtY);

        return;
      }

      if (k >= 1000000000000n) {
        rowOutputError(k);
        return;
      }

      k++;
    }
  }
}

function sqrtBigInt(n) {
  if (n < 0n) return null;
  if (n === 0n) return 0n;

  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }

  return x * x === n ? x : null;
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

function isPrimeBigInt(num) {
  if (num <= 1n) return false;
  if (num <= 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  let i = 5n;
  while (i * i <= num) {
    if (num % i === 0n || num % (i + 2n) === 0n) return false;
    i += 6n;
  }
  return true;
}

function rowOutputFirst(n, sNT, sT) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";

  if (sNT !== sT) {
    rowOutput.innerHTML = `<strong>Шаг ${globalCount}.1:</strong> Возьмем число n = ${n}. Вычислим s = <math><mroot><mi>${n}</mi><mn></mn> </mroot></math> ≈ ${sNT} или s = [<math><mroot><mi>${n}</mi><mn></mn> </mroot></math>] = ${sT}`;
  } else {
    rowOutput.innerHTML = `Возьмем число n = ${n}. Вычислим s = [<math><mroot><mi>${n}</mi><mn></mn> </mroot></math>] = ${sNT}`;
  }

  resultOutput.appendChild(rowOutput);
}

function rowOutputSecond() {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";

  rowOutput.innerHTML = `<strong>Шаг ${globalCount}.2:</strong> Дальше построим таблицу, которая будет содержать значения y = (s + k)<sup>2</sup> - n и <math><mroot><mi>y</mi><mn></mn> </mroot></math> на каждом шаге итерации.<br /> Получим:<br />
  <strong>Шаг ${globalCount}.3:</strong>`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputThird(parametrs, parametrsValue) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output-table";

  const table = document.createElement("table");
  const tHead = document.createElement("thead");
  const trHead = document.createElement("tr");

  for (let i = 0; i < parametrs.length; i++) {
    const th = document.createElement("th");
    th.innerHTML = parametrs[i];
    trHead.appendChild(th);
  }

  tHead.appendChild(trHead);
  table.appendChild(tHead);

  const tBody = document.createElement("tbody");

  for (let i = 0; i < parametrsValue.length; i++) {
    const trBody = document.createElement("tr");

    for (let j = 0; j < parametrsValue[i].length; j++) {
      const td = document.createElement("td");
      td.innerHTML = parametrsValue[i][j];
      trBody.appendChild(td);
    }

    tBody.appendChild(trBody);
  }

  table.appendChild(tBody);
  rowOutput.appendChild(table);
  resultOutput.appendChild(rowOutput);
}

function rowOutputFourth(sqrtY, s, k, a, b) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}.4:</strong> <br /> <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${sqrtY}<br />
a = s + k + <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} + ${sqrtY} = ${a}<br />
b = s + k - <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} - ${sqrtY} = ${b}<br />
  ${a} * ${b} = ${a * b}`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputFifth(primeNumbers) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";

  if (primeNumbers.length === 0) {
    rowOutput.innerHTML = `<strong>Итог:</strong> не удалось разложить на простые множители`;
    resultOutput.appendChild(rowOutput);
    return;
  }

  rowOutput.innerHTML = `<strong>Итог:</strong> `;

  const isBigInt = typeof primeNumbers[0] === "bigint";

  let result = isBigInt ? 1n : 1;
  let formula = "";

  for (let i = 0; i < primeNumbers.length; i++) {
    if (isBigInt) {
      result *= primeNumbers[i];
    } else {
      result *= primeNumbers[i];
    }

    if (i === 0) {
      formula += `${primeNumbers[i]}`;
    } else {
      formula += ` * ${primeNumbers[i]}`;
    }
  }

  rowOutput.innerHTML += `${formula} = ${result}`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputError(k) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `Даже на k = ${k} ничего не нашли :(`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputFirstBigInt(n, s) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}.1:</strong> Возьмем число n = ${n}. Вычислим s = [<math><mroot><mi>${n}</mi><mn></mn></mroot></math>] = ${s}`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputSecondBigInt() {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}.2:</strong> Будем последовательно вычислять y = (s + k)² - n и проверять, является ли y квадратом целого числа.`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputBigIntResult(s, k, sqrtY) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}.3:</strong> <br /> a = s + k + <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} + ${sqrtY} = ${
    s + k + sqrtY
  }<br>
    b = s + k - <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} - ${sqrtY} = ${
    s + k - sqrtY
  }<br>
    ${s + k + sqrtY} * ${s + k - sqrtY} = ${
    (s + k + sqrtY) * (s + k - sqrtY)
  }<br>
  `;

  resultOutput.appendChild(rowOutput);
}
