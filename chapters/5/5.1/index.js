/**
 5.1 Dissecting Promise.all(): Implement your own version of Promise.
all() leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart.
 */

async function promiseAll(promises) {
  const results = [];

  return new Promise((resolve, reject) => {
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((value) => {
          results[i] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
    if (promises.length === 0) resolve([]);
  });
}

function delayError() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Ha ocurrido un error"));
    }, 3000);
  });
}

async function delaySuccess() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Todo ha salido bien");
    }, 3000);
  });
}

const allPromise = await promiseAll([
  ,
  delaySuccess(),
  delaySuccess(),
  delayError(),
]);

console.log(allPromise);
