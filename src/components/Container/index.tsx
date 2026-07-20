interface ContainerProps {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto border-1 border-solid rounded-sm border-zinc-300 p-4 md:p-6 space-y-4">
      {children}
    </div>
  )
}
