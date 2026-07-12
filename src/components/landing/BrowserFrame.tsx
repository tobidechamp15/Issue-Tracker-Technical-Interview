interface BrowserFrameProps {
  children?: React.ReactNode;
}

export default function BrowserFrame({ children }: BrowserFrameProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-default bg-surface">

      <div className="flex items-center gap-2 px-4 py-3 bg-surface-secondary border-b border-default">

        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>


        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 bg-surface rounded-md border border-default text-xs text-muted w-64 text-center">
            /dashboard
          </div>
        </div>


        <div className="w-13" />
      </div>


      <div className="bg-surface-secondary">
        {children || (
          <div className="aspect-16/10 flex items-center justify-center text-subtle text-sm">
            Dashboard preview
          </div>
        )}
      </div>
    </div>
  );
}
