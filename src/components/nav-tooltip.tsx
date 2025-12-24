import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavTooltip({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="bg-primary-green border-none hover:bg-white/10 hover:text-primary-orange text-primary-orange shadow-none py-2">{title}</Button>
      </TooltipTrigger>
      <TooltipContent  sideOffset={10}>{content}</TooltipContent>
    </Tooltip>
  );
}
