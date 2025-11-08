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

  const value = input.value.trim();
  const n = parseInputNumber(value);

  factorizeFerma(n);

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

function factorizeFerma(n) {
  let s;
  parametrsValue = [];
  resultOutput.innerHTML = "";
  if (typeof n !== "bigint") {
    s = calculateS(n);

    rowOutputFirst(n, s[0], s[1]);
    rowOutputSecond();

    let k = 1;

    while (true) {
      const y = Math.pow(s[1] + k, 2) - n;
      const sqrtY = Math.sqrt(y);

      const arr = [k, y, sqrtY];
      parametrsValue.push(arr);

      if (Number.isInteger(sqrtY)) {
        rowOutputThird(parametrs, parametrsValue);
        rowOutputFourth(sqrtY, s[1], k);
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

      if (k >= 1000000n) {
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

function rowOutputFirst(n, sNT, sT) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";

  if (sNT !== sT) {
    rowOutput.innerHTML = `Возьмем число n = ${n}. Вычислим s = <math><mroot><mi>${n}</mi><mn></mn> </mroot></math> ≈ ${sNT} или s = [<math><mroot><mi>${n}</mi><mn></mn> </mroot></math>] = ${sT}`;
  } else {
    rowOutput.innerHTML = `Возьмем число n = ${n}. Вычислим s = [<math><mroot><mi>${n}</mi><mn></mn> </mroot></math>] = ${sNT}`;
  }

  resultOutput.appendChild(rowOutput);
}

function rowOutputSecond() {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `Дальше построим таблицу, которая будет содержать значения y = (s + k)<sup>2</sup> - n и <math><mroot><mi>y</mi><mn></mn> </mroot></math> на каждом шаге итерации.<br /> Получим:`;
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

function rowOutputFourth(sqrtY, s, k) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `<math><mroot><mi>y</mi><mn></mn></mroot></math> = ${sqrtY}<br />
a = s + k + <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} + ${sqrtY} = ${
    s + k + sqrtY
  }<br />
b = s + k - <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} - ${sqrtY} = ${
    s + k - sqrtY
  }<br />
  ${s + k + sqrtY} * ${s + k - sqrtY} = ${(s + k + sqrtY) * (s + k - sqrtY)}`;
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
  rowOutput.innerHTML = `Возьмем число n = ${n}. Вычислим s = [<math><mroot><mi>${n}</mi><mn></mn></mroot></math>] = ${s}`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputSecondBigInt() {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `Будем последовательно вычислять y = (s + k)² - n и проверять, является ли y квадратом целого числа.`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputBigIntResult(s, k, sqrtY) {
  const rowOutput = document.createElement("div");
  rowOutput.className = "row-output";
  rowOutput.innerHTML = `a = s + k + <math><mroot><mi>y</mi><mn></mn></mroot></math> = ${s} + ${k} + ${sqrtY} = ${
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
