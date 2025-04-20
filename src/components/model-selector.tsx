"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const models = [
  {
    value: "bart",
    label: "BART",
    description: "Bidirectional Auto-Regressive Transformer",
  },
  {
    value: "t5",
    label: "T5",
    description: "Text-to-Text Transfer Transformer",
  },
  {
    value: "flan-t5",
    label: "Flan-T5",
    description: "T5 fine-tuned on instructional tasks",
  },
  {
    value: "pegasus",
    label: "Pegasus",
    description: "Optimized for abstractive summarization",
  },
];

interface ModelSelectorProps {
  onModelSelect: (selectedModels: string[]) => void;
  disabled?: boolean;
}

export function ModelSelector({
  onModelSelect,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);

  const onModelSelectRef = React.useRef(onModelSelect);

  React.useEffect(() => {
    onModelSelectRef.current = onModelSelect;
  }, [onModelSelect]);

  React.useEffect(() => {
    onModelSelectRef.current(selectedModel ? [selectedModel] : []);
  }, [selectedModel]);

  const selectModel = (value: string) => {
    setSelectedModel((currentValue) => (currentValue === value ? null : value));
    setOpen(false);
  };

  const selectedModelLabel = selectedModel
    ? models.find((model) => model.value === selectedModel)?.label
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-8 px-2 text-xs font-normal border-0 hover:bg-gray-800/80 focus:ring-0"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
            {selectedModelLabel || "AI Model"}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 bg-gray-900/95 border border-gray-800 shadow-xl backdrop-blur-md">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search models..."
            className="h-8 text-sm border-b border-gray-800/60 text-white"
          />
          <CommandList className="py-1">
            <CommandEmpty className="text-xs text-gray-400 py-2">
              No model found.
            </CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={() => selectModel(model.value)}
                  className="py-1.5 px-2 text-sm transition-colors hover:bg-blue-400/90 hover:text-black aria-selected:bg-gray-800/90 group"
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-2 h-3 w-3 rounded-full",
                        selectedModel === model.value
                          ? "bg-gradient-to-r from-blue-400 to-purple-400"
                          : "bg-gray-700"
                      )}
                    />
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium group-hover:!text-black",
                          selectedModel === model.value
                            ? "text-white"
                            : "text-gray-200"
                        )}
                      >
                        {model.label}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] line-clamp-1 group-hover:!text-black",
                          selectedModel === model.value
                            ? "text-gray-300"
                            : "text-gray-400"
                        )}
                      >
                        {model.description}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
