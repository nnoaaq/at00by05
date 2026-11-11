"use client";

import * as React from "react";
import { da, fi } from "date-fns/locale";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
//   changeSelectedSensor: (sensorId: string) => void;

export function DatePickerWithRange({
  updateSelectedDays,
}: {
  updateSelectedDays: (days: { from: number; to: number }) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  return (
    <Field>
      <FieldLabel
        htmlFor="date-picker-range"
        className="block translate-y-2 translate-x-2 bg-zinc-800 w-fit text-lime-500 uppercase text-xs"
      >
        Valitse päivämäärä
      </FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal hover:text-zinc-300 bg-transparent hover:bg-transparent border border-zinc-600"
            >
              <CalendarIcon data-icon="inline-start" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "d.M.yyyy")} -{" "}
                    {format(date.to, "d.M.yyyy")}
                  </>
                ) : (
                  format(date.from, "d.M.yyyy")
                )
              ) : (
                <span>Klikkaa avataksesi kalenterin</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0 border" align="start">
          <Calendar
            mode="range"
            locale={fi}
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate?.from && newDate?.to) {
                const endDate = new Date(newDate.to);
                endDate.setHours(23, 59, 59, 999);
                updateSelectedDays({
                  from: Math.floor(newDate.from?.getTime() / 1000),
                  to: Math.floor(endDate?.getTime() / 1000),
                });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
