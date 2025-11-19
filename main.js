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

  return BigInt(value);
}

function validInput(value) {
  removeErrorInputMsg();

  if (isNaN(Number(value))) {
    addErrorInputMsg("Вы ввели строку!");
    return false;
  }

  if (!Number.isInteger(Number(value))) {
    addErrorInputMsg("Введите целое число!");
    return false;
  }

  if (Number(value) < 2) {
    addErrorInputMsg("Вы ввели число меньше 2!");
    return false;
  }

  return true;
}

function addErrorInputMsg(msg) {
  input.classList.add("error-input-msg");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-msg";
  errorDiv.innerHTML = msg;
  input.parentNode.appendChild(errorDiv);
}

function removeErrorInputMsg() {
  const existingError = input.parentNode.querySelector(".error-msg");
  if (existingError) {
    existingError.remove();
  }
  input.classList.remove("error-input-msg");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resultOutput.innerHTML = "";
  resetCount();

  const value = input.value.trim();

  if (!validInput(value)) {
    document.querySelector(".result-section").hidden = true;
    return;
  }

  const n = parseInputNumber(value);

  factorizeFerma(n);

  rowOutputFifth(primeNumbers);

  document.querySelector(".result-section").hidden = false;
});

form.addEventListener("reset", (e) => {
  resultOutput.innerHTML = "";
  document.querySelector(".result-section").hidden = true;

  removeErrorInputMsg();
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
  return [guess, guess + 1n];
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
    while (n % 2 === 0) {
      primeNumbers.push(2);
      rowOutputFindNumDivTwo(n);
      n = n / 2;
      globalCount++;
      if (n < 2) return;
    }

    if (isPrime(n)) {
      rowOutputFindPrime(n);
      primeNumbers.push(n);
      globalCount++;
      return;
    }

    s = calculateS(n);

    rowOutputStart(n);
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

        if (a > 1) {
          if (!isPrime(a)) {
            factorizeFerma(a, depth + 1);
          } else {
            primeNumbers.push(a);
          }
        }

        if (b > 1) {
          if (!isPrime(b)) {
            factorizeFerma(b, depth + 1);
          } else {
            primeNumbers.push(b);
          }
        }

        return;
      }

      if (k >= 100000) {
        rowOutputError(k);
        return;
      }

      k++;
    }
  } else {
    while (n % 2n === 0n) {
      primeNumbers.push(2n);
      rowOutputFindNumDivTwo(2n);
      n = n / 2n;
      globalCount++;
      if (n < 2n) return;
    }

    if (isPrimeBigInt(n)) {
      rowOutputFindPrime(n);
      primeNumbers.push(n);
      globalCount++;
      return;
    }

    const s = calculateBigIntS(n);

    rowOutputStart(n);
    rowOutputFirst(n, s[0], s[1]);
    rowOutputSecond();

    let k = 0n;

    while (true) {
      const x = s[1] + k;
      const y = x * x - n;
      const sqrtY = sqrtBigInt(y);

      const arr = [k, y, sqrtY];
      parametrsValue.push(arr);

      if (sqrtY !== null) {
        const a = x + sqrtY;
        const b = x - sqrtY;

        rowOutputThird(parametrs, parametrsValue);
        rowOutputFourth(sqrtY, s[1], k, a, b);

        if (a > 1n) {
          if (!isPrimeBigInt(a)) {
            factorizeFerma(a, depth + 1);
          } else {
            primeNumbers.push(a);
          }
        }

        if (b > 1n) {
          if (!isPrimeBigInt(b)) {
            factorizeFerma(b, depth + 1);
          } else {
            primeNumbers.push(b);
          }
        }

        return;
      }

      if (k >= 100000n) {
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

  const smallPrimes = [
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
  ];
  for (const prime of smallPrimes) {
    if (num === prime) return true;
    if (num % prime === 0n) return false;
  }

  if (num > 1000000n) {
    return isProbablePrime(num, 5);
  }

  let i = 5n;
  while (i * i <= num && i < 100000n) {
    if (num % i === 0n || num % (i + 2n) === 0n) return false;
    i += 6n;
  }

  return true;
}

function isProbablePrime(n, k) {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;

  let r = 0n;
  let d = n - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
    r += 1n;
  }

  for (let i = 0; i < k; i++) {
    const a = getRandomBigInt(2n, n - 2n);
    let x = modPow(a, d, n);

    if (x === 1n || x === n - 1n) continue;

    let continueLoop = false;
    for (let j = 1n; j < r; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        continueLoop = true;
        break;
      }
    }

    if (!continueLoop) return false;
  }

  return true;
}

function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;

  let result = 1n;
  base = base % modulus;

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }

  return result;
}

function getRandomBigInt(min, max) {
  const range = max - min;
  const bits = range.toString(2).length;
  let result;

  do {
    result = BigInt(
      "0b" +
        Array.from({ length: bits }, () =>
          Math.random() > 0.5 ? "1" : "0"
        ).join("")
    );
  } while (result > range);

  return result + min;
}

function rowOutputFindPrime(n) {
  const rowOutput = document.createElement("div");
  rowOutput.classList.add("row-output");
  rowOutput.classList.add("big-font");
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}: </strong>n = ${n} является простым`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputFindNumDivTwo(n) {
  const rowOutput = document.createElement("div");
  rowOutput.classList.add("row-output");
  rowOutput.classList.add("big-font");
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}: </strong>${n} = ${
    n / 2
  } * 2`;
  resultOutput.appendChild(rowOutput);
}

function rowOutputStart(n) {
  const rowOutput = document.createElement("div");
  rowOutput.classList.add("row-output");
  rowOutput.classList.add("big-font");
  rowOutput.innerHTML = `<strong>Шаг ${globalCount}: </strong>Разложим число n = ${n}`;
  resultOutput.appendChild(rowOutput);
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
  rowOutput.classList.add("row-output");
  rowOutput.classList.add("error-msg");
  rowOutput.innerHTML = `Даже на k = ${k} ничего не нашли :(`;
  resultOutput.appendChild(rowOutput);
}
