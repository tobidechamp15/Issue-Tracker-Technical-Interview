interface BrowserFrameProps {
  children?: React.ReactNode;
}

export default function BrowserFrame({ children }: BrowserFrameProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
      {/* Chrome top bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>

        {/* Fake URL pill */}
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 bg-white rounded-md border border-gray-200 text-xs text-gray-400 w-64 text-center">
            issuetracker.app/dashboard
          </div>
        </div>

        {/* Spacer to balance the dots */}
        <div className="w-[52px]" />
      </div>

      {/* Frame content */}
      <div className="bg-gray-50">
        {children || (
          <div className="aspect-[16/10] flex items-center justify-center text-gray-400 text-sm">
            Dashboard preview — screenshot coming soon
          </div>
        )}
      </div>
    </div>
  );
}
