import { SearchingStep } from '../types';
import { sleep, getSpeedDelay } from '../utils/arrayHelpers';

export class SearchingAlgorithms {
  static async *linearSearch(arr: number[], target: number, speed: number): AsyncGenerator<SearchingStep> {
    for (let i = 0; i < arr.length; i++) {
      yield {
        array: [...arr],
        comparing: [i],
        found: [],
        current: [i]
      };

      await sleep(getSpeedDelay(speed));

      if (arr[i] === target) {
        yield {
          array: [...arr],
          comparing: [],
          found: [i],
          current: []
        };
        return;
      }
    }

    yield {
      array: [...arr],
      comparing: [],
      found: [],
      current: []
    };
  }

  static async *binarySearch(arr: number[], target: number, speed: number): AsyncGenerator<SearchingStep> {
    // First sort the array for binary search
    const sortedArr = [...arr].sort((a, b) => a - b);
    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      yield {
        array: [...sortedArr],
        comparing: [mid],
        found: [],
        current: Array.from({ length: right - left + 1 }, (_, i) => left + i)
      };

      await sleep(getSpeedDelay(speed));

      if (sortedArr[mid] === target) {
        yield {
          array: [...sortedArr],
          comparing: [],
          found: [mid],
          current: []
        };
        return;
      } else if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    yield {
      array: [...sortedArr],
      comparing: [],
      found: [],
      current: []
    };
  }

  static async *jumpSearch(arr: number[], target: number, speed: number): AsyncGenerator<SearchingStep> {
    // First sort the array for jump search
    const sortedArr = [...arr].sort((a, b) => a - b);
    const n = sortedArr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;

    // Finding the block where element is present
    while (sortedArr[Math.min(step, n) - 1] < target) {
      yield {
        array: [...sortedArr],
        comparing: [Math.min(step, n) - 1],
        found: [],
        current: Array.from({ length: Math.min(step, n) - prev }, (_, i) => prev + i)
      };

      await sleep(getSpeedDelay(speed));

      prev = step;
      step += Math.floor(Math.sqrt(n));
      
      if (prev >= n) {
        yield {
          array: [...sortedArr],
          comparing: [],
          found: [],
          current: []
        };
        return;
      }
    }

    // Linear search in the identified block
    while (sortedArr[prev] < target) {
      yield {
        array: [...sortedArr],
        comparing: [prev],
        found: [],
        current: [prev]
      };

      await sleep(getSpeedDelay(speed));

      prev++;

      if (prev === Math.min(step, n)) {
        yield {
          array: [...sortedArr],
          comparing: [],
          found: [],
          current: []
        };
        return;
      }
    }

    if (sortedArr[prev] === target) {
      yield {
        array: [...sortedArr],
        comparing: [],
        found: [prev],
        current: []
      };
      return;
    }

    yield {
      array: [...sortedArr],
      comparing: [],
      found: [],
      current: []
    };
  }
}