export function AboutEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Page</h1>
        <p className="text-gray-400 mt-1">Edit company story, mission, vision, and team</p>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">About Editor</h2>
        <p className="text-gray-400">Coming in Phase 3</p>
      </div>
    </div>
  )
}
