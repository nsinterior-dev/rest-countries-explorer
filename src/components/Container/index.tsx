interface ContainerProps {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-l border-1 border-solid rounded-sm border-zinc-300 p-4 space-y-4">
      {children}
    </div>
  )
}
