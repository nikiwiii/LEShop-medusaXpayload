import * as Icons from "lucide-react"

export const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}
