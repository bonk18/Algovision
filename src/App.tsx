import React, { useState } from 'react';
import { BarChart3, Search, Github, Code2 } from 'lucide-react';
import SortingVisualizer from './components/SortingVisualizer';
import SearchingVisualizer from './components/SearchingVisualizer';

type ViewMode = 'sorting' | 'searching';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('sorting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Code2 size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AlgoVision</h1>
              <span className="text-purple-300 text-sm">Algorithm Visualizer</span>
            </div>
            
            <nav className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('sorting')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'sorting'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <BarChart3 size={20} />
                Sorting
              </button>
              
              <button
                onClick={() => setCurrentView('searching')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'searching'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Search size={20} />
                Searching
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Github size={20} />
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            {currentView === 'sorting' ? 'Sorting Algorithms' : 'Searching Algorithms'}
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {currentView === 'sorting' 
              ? 'Visualize how different sorting algorithms organize data step-by-step. Watch as elements are compared, swapped, and sorted in real-time.'
              : 'Explore various searching techniques to find specific elements in arrays. See how different algorithms approach the search problem.'
            }
          </p>
        </div>

        {/* Visualizer Component */}
        <div className="space-y-6">
          {currentView === 'sorting' ? <SortingVisualizer /> : <SearchingVisualizer />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">About AlgoVision</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              AlgoVision is an interactive educational tool designed to help students and developers understand 
              fundamental algorithms through visual demonstrations. Each animation shows the step-by-step process 
              of how algorithms work, making complex concepts easier to grasp.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div>
                <h4 className="font-medium text-white mb-2">Sorting Algorithms</h4>
                <ul className="space-y-1">
                  <li>Bubble Sort</li>
                  <li>Selection Sort</li>
                  <li>Insertion Sort</li>
                  <li>Merge Sort</li>
                  <li>Quick Sort</li>
                  <li>Heap Sort</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Searching Algorithms</h4>
                <ul className="space-y-1">
                  <li>Linear Search</li>
                  <li>Binary Search</li>
                  <li>Jump Search</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>Real-time visualization</li>
                  <li>Adjustable speed control</li>
                  <li>Multiple array sizes</li>
                  <li>Time complexity display</li>
                  <li>Interactive controls</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-4">
              <p className="text-gray-400">
                Built with React, TypeScript, and Tailwind CSS • Made for educational purposes
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;