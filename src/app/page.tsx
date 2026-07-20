import { Countries } from "@/features/Countries";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-background p-8">
      <Countries />
    </div>
  );
}
