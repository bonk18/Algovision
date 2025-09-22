import { SortingStep } from '../types';
import { sleep, getSpeedDelay } from '../utils/arrayHelpers';

export class SortingAlgorithms {
  private static async *bubbleSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        yield {
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
        };

        await sleep(getSpeedDelay(speed));

        if (array[j] > array[j + 1]) {
          yield {
            array: [...array],
            comparing: [j, j + 1],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
          };

          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          await sleep(getSpeedDelay(speed));
        }
      }
    }

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    };
  }

  private static async *selectionSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        yield {
          array: [...array],
          comparing: [minIndex, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k)
        };

        await sleep(getSpeedDelay(speed));

        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        yield {
          array: [...array],
          comparing: [],
          swapping: [i, minIndex],
          sorted: Array.from({ length: i }, (_, k) => k)
        };

        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        await sleep(getSpeedDelay(speed));
      }
    }

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    };
  }

  private static async *insertionSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];
    const n = array.length;

    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;

      yield {
        array: [...array],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k)
      };

      await sleep(getSpeedDelay(speed));

      while (j >= 0 && array[j] > key) {
        yield {
          array: [...array],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: []
        };

        array[j + 1] = array[j];
        j--;
        await sleep(getSpeedDelay(speed));
      }

      array[j + 1] = key;
    }

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    };
  }

  private static async *mergeSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];
    
    async function* mergeSortHelper(left: number, right: number): AsyncGenerator<SortingStep> {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);
      
      yield* mergeSortHelper(left, mid);
      yield* mergeSortHelper(mid + 1, right);
      
      yield* merge(left, mid, right);
    }

    async function* merge(left: number, mid: number, right: number): AsyncGenerator<SortingStep> {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        yield {
          array: [...array],
          comparing: [left + i, mid + 1 + j],
          swapping: [],
          sorted: []
        };

        await sleep(getSpeedDelay(speed));

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++;
        k++;
      }

      yield {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: right - left + 1 }, (_, idx) => left + idx)
      };

      await sleep(getSpeedDelay(speed));
    }

    yield* mergeSortHelper(0, array.length - 1);

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k)
    };
  }

  private static async *quickSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];

    async function* quickSortHelper(low: number, high: number): AsyncGenerator<SortingStep> {
      if (low < high) {
        const pi = yield* partition(low, high);
        yield* quickSortHelper(low, pi - 1);
        yield* quickSortHelper(pi + 1, high);
      }
    }

    async function* partition(low: number, high: number): AsyncGenerator<number> {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        yield {
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: []
        };

        await sleep(getSpeedDelay(speed));

        if (array[j] < pivot) {
          i++;
          if (i !== j) {
            yield {
              array: [...array],
              comparing: [],
              swapping: [i, j],
              sorted: []
            };

            [array[i], array[j]] = [array[j], array[i]];
            await sleep(getSpeedDelay(speed));
          }
        }
      }

      yield {
        array: [...array],
        comparing: [],
        swapping: [i + 1, high],
        sorted: []
      };

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      await sleep(getSpeedDelay(speed));

      return i + 1;
    }

    yield* quickSortHelper(0, array.length - 1);

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k)
    };
  }

  private static async *heapSort(arr: number[], speed: number): AsyncGenerator<SortingStep> {
    const array = [...arr];
    const n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      yield {
        array: [...array],
        comparing: [],
        swapping: [0, i],
        sorted: Array.from({ length: n - i - 1 }, (_, k) => n - 1 - k)
      };

      [array[0], array[i]] = [array[i], array[0]];
      await sleep(getSpeedDelay(speed));

      yield* heapify(i, 0);
    }

    async function* heapify(size: number, rootIndex: number): AsyncGenerator<SortingStep> {
      let largest = rootIndex;
      const left = 2 * rootIndex + 1;
      const right = 2 * rootIndex + 2;

      if (left < size) {
        yield {
          array: [...array],
          comparing: [largest, left],
          swapping: [],
          sorted: Array.from({ length: n - size }, (_, k) => n - 1 - k)
        };

        await sleep(getSpeedDelay(speed));

        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        yield {
          array: [...array],
          comparing: [largest, right],
          swapping: [],
          sorted: Array.from({ length: n - size }, (_, k) => n - 1 - k)
        };

        await sleep(getSpeedDelay(speed));

        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest !== rootIndex) {
        yield {
          array: [...array],
          comparing: [],
          swapping: [rootIndex, largest],
          sorted: Array.from({ length: n - size }, (_, k) => n - 1 - k)
        };

        [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
        await sleep(getSpeedDelay(speed));

        yield* heapify(size, largest);
      }
    }

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    };
  }

  static getSortingAlgorithm(algorithm: string) {
    switch (algorithm) {
      case 'bubble': return this.bubbleSort;
      case 'selection': return this.selectionSort;
      case 'insertion': return this.insertionSort;
      case 'merge': return this.mergeSort;
      case 'quick': return this.quickSort;
      case 'heap': return this.heapSort;
      default: return this.bubbleSort;
    }
  }
}