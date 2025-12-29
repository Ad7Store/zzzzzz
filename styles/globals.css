@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .btn-primary {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg;
  }
  
  .btn-secondary {
    @apply bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105;
  }
  
  .card-hover {
    @apply transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2;
  }
  
  .glass-effect {
    @apply backdrop-blur-lg bg-white/10 border border-white/20;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-500 to-purple-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply from-blue-600 to-purple-700;
}

/* Animations */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
