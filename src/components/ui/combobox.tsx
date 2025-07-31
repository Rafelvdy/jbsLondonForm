"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

// ... other imports stay the same

// Define the props interface
interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  systems: { value: string; label: string }[];
}

export function Combobox({ 
  value, 
  onValueChange, 
  open: externalOpen, 
  onOpenChange,
  systems
}: ComboboxProps) {
  // Use internal state for open/close if not controlled externally
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  // Use external open state if provided, otherwise use internal
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // const systems = [
  //   {
  //     value: "boiler",
  //     label: "Boiler(s)",
  //   },
  //   {
  //     value: "AC",
  //     label: "Chillers / AC Systems",
  //   },
  //   {
  //     value: "AHU",
  //     label: "Air Handling Units (AHUs)",
  //   },
  //   {
  //     value: "FCU",
  //     label: "Fan Coil Units (FCUs)",
  //   },
  //   {
  //     value: "pump",
  //     label: "Pumps",
  //   },
  //   {
  //     value: "pipework",
  //     label: "Pipework",
  //   },
  //   {
  //     value: "bms-controls",
  //     label: "BMS Controls",
  //   },
    
  //   {
  //     value: "ductwork",
  //     label: "Ductwork",
  //   },
  //   {
  //     value: "hot-water-cylinders",
  //     label: "Hot Water Cylinders",
  //   },
  //   {
  //     value: "water-tanks",
  //     label: "Water Tanks",
  //   },
  //   {
  //     value: "expansion-vessel",
  //     label: "Expansion Vessel",
  //   },
  // ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? systems.find((system) => system.value === value)?.label
            : "Select a System..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search a system..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {systems.map((system) => (
                <CommandItem
                  key={system.value}
                  value={system.value}
                  onSelect={(currentValue) => {
                    // Use the external handler instead of internal setState
                    const newValue = currentValue === value ? "" : currentValue;
                    onValueChange(newValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === system.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {system.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}