"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { User } from "../types/schema.types";
import type { Document } from "@upstash/query"

type WeekleyCardProps = {
  data: Document<User>[];
};

export default function WeekleyCard({ data }: WeekleyCardProps) {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const date = new Date();

  console.log("data", data);

  const currentWeek: string = date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const nextWeek: string = new Date(
    date.getTime() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prevWeek: string = new Date(
    date.getTime() - 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysOfWeek: Array<{ label: string; value: string }> = [
    {
      label: "Lunes",
      value: "monday",
    },
    {
      label: "Martes",
      value: "tuesday",
    },
    {
      label: "Miércoles",
      value: "wednesday",
    },
    {
      label: "Jueves",
      value: "thursday",
    },
    {
      label: "Viernes",
      value: "friday",
    },
    {
      label: "Sábado",
      value: "saturday",
    },
    {
      label: "Domingo",
      value: "sunday",
    },
  ];

  const availableDays: string[] = daysOfWeek.map((day) => day.label);

  const dateDayByLocal = date
    .toLocaleDateString("en-EN", {
      weekday: "long",
    })
    .toLocaleLowerCase();

  const index = daysOfWeek.findIndex((day) => day.value === dateDayByLocal);
  const indexSelectedDay = daysOfWeek.findIndex((day) => day.value === selectedDay);

  const currentDay = availableDays[index];
  const selectedDayOfWeek = daysOfWeek[indexSelectedDay];

  return (
    <div className="border rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-800">
        Semana del {currentWeek}
      </h3>
      <div className="flex justify-between mt-4">
        <div>
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {prevWeek}
          </Button>
        </div>
        <div>
          <Button variant="outline" size="sm">
            {nextWeek}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        className="my-4"
        defaultValue={currentDay}
        onValueChange={(value) => setSelectedDay(value)}
      >
        <TabsList className="w-full my-6 flex justify-between">
          {daysOfWeek.map((day, index) => (
            <TabsTrigger key={index} value={day.value} className="truncate">
              {day.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedDay}>
            <div key={index} className="mb-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedDayOfWeek?.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="start">Inicio</Label>
                    <Input type="time" id="start" />
                  </div>
                  <div>
                    <Label htmlFor="end">Fin</Label>
                    <Input type="time" id="end" />
                  </div>
                </div>
                <CardDescription>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    placeholder="Descripción de la actividad"
                  />
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Guardar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
