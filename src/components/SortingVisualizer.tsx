import React, { useState, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { SortingAlgorithms } from '../algorithms/sorting';
import { generateRandomArray } from '../utils/arrayHelpers';
import { AlgorithmState, SortingAlgorithm } from '../types';

const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)' },
  { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)' },
  { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' },
  { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
  { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)' }
];

export default function SortingVisualizer() {
  const [state, setState] = useState<AlgorithmState>({
    array: generateRandomArray(50),
    comparing: [],
    swapping: [],
    sorted: [],
    found: [],
    current: [],
    isRunning: false,
    isCompleted: false
  });
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [speed, setSpeed] = useState(5);
  const [arraySize, setArraySize] = useState(50);
  
  const animationRef = useRef<{ generator: AsyncGenerator | null; isRunning: boolean }>({
    generator: null,
    isRunning: false
  });

  const generateNewArray = useCallback(() => {
    if (state.isRunning) return;
    
    setState(prev => ({
      ...prev,
      array: generateRandomArray(arraySize),
      comparing: [],
      swapping: [],
      sorted: [],
      isCompleted: false
    }));
  }, [arraySize, state.isRunning]);

  const resetArray = useCallback(() => {
    animationRef.current.isRunning = false;
    setState(prev => ({
      ...prev,
      comparing: [],
      swapping: [],
      sorted: [],
      isRunning: false,
      isCompleted: false
    }));
  }, []);

  const startSorting = useCallback(async () => {
    if (state.isRunning) {
      animationRef.current.isRunning = false;
      setState(prev => ({ ...prev, isRunning: false }));
      return;
    }

    setState(prev => ({ ...prev, isRunning: true, isCompleted: false }));
    animationRef.current.isRunning = true;

    const sortFunction = SortingAlgorithms.getSortingAlgorithm(selectedAlgorithm);
    const generator = sortFunction(state.array, speed);
    animationRef.current.generator = generator;

    try {
      for await (const step of generator) {
        if (!animationRef.current.isRunning) break;
        
        setState(prev => ({
          ...prev,
          array: step.array,
          comparing: step.comparing,
          swapping: step.swapping,
          sorted: step.sorted
        }));
      }
    } catch (error) {
      console.error('Sorting error:', error);
    }

    setState(prev => ({ 
      ...prev, 
      isRunning: false, 
      isCompleted: true,
      comparing: [],
      swapping: []
    }));
    animationRef.current.isRunning = false;
  }, [state.array, selectedAlgorithm, speed, state.isRunning]);

  const getBarColor = (index: number) => {
    if (state.sorted.includes(index)) return 'bg-green-500';
    if (state.swapping.includes(index)) return 'bg-red-500';
    if (state.comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const maxHeight = Math.max(...state.array);

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Sorting Algorithms</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => !state.isRunning && setSelectedAlgorithm(algo.id as SortingAlgorithm)}
              disabled={state.isRunning}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${
                selectedAlgorithm === algo.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              } ${state.isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium">{algo.name}</div>
              <div className="text-sm opacity-75">{algo.complexity}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={startSorting}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
          >
            {state.isRunning ? <Pause size={20} /> : <Play size={20} />}
            {state.isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={resetArray}
            disabled={state.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <RotateCcw size={20} />
            Reset
          </button>

          <button
            onClick={generateNewArray}
            disabled={state.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Shuffle size={20} />
            New Array
          </button>

          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Speed:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={state.isRunning}
              className="w-20 accent-purple-500 disabled:opacity-50"
            />
            <span className="text-white">{speed}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Size:</label>
            <input
              type="range"
              min="10"
              max="150"
              value={arraySize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setArraySize(newSize);
                if (!state.isRunning) {
                  setState(prev => ({
                    ...prev,
                    array: generateRandomArray(newSize),
                    comparing: [],
                    swapping: [],
                    sorted: [],
                    isCompleted: false
                  }));
                }
              }}
              disabled={state.isRunning}
              className="w-20 accent-purple-500 disabled:opacity-50"
            />
            <span className="text-white">{arraySize}</span>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-end justify-center gap-1 h-96 overflow-hidden">
          {state.array.map((value, index) => (
            <div
              key={index}
              className={`transition-all duration-150 ${getBarColor(index)} rounded-t-sm`}
              style={{
                height: `${(value / maxHeight) * 350}px`,
                width: `${Math.max(2, Math.floor(800 / state.array.length))}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-white">Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-white">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
}