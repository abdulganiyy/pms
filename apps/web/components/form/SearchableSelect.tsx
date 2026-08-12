"use client";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { FieldConfig } from "@/types";
import { cn } from "@/lib/utils";

type SearchableSelectProps = {
  field: FieldConfig;
  control: Control<any>;
};

export const SearchableSelect = ({ field, control }: SearchableSelectProps) => {
  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: controllerField }) => {
        const selectedOption = field.options?.find(
          (option) => option.value === controllerField.value,
        );
        return (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={field.disabled}
                >
                  {selectedOption?.label ?? field.placeholder ?? "Select..."}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty> No results found. </CommandEmpty>
                  <CommandGroup>
                    {field.options?.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => controllerField.onChange(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            controllerField.value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};
