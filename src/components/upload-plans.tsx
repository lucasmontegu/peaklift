"use client";

import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import useUploadPlan from "@/hooks/use-upload-plan";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  file: z.string().min(1, {
    message: "El archivo es requerido",
  }),
  start_date: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  end_date: z.date({
    required_error: "La fecha de fin es requerida",
  }),
});

export default function UploadPlans() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    loading,
    handleUploadFile,
    onSubmit,
    isSuccess,
    error
  } = useUploadPlan()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmitForm(values: z.infer<typeof schema>) {
    onSubmit({
      file: values.file,
      start_date: values.start_date,
      end_date: values.end_date,
    });
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      form.reset();
      toast.success("Plan subido exitosamente");
    }
  }, [isSuccess]);

  return (
    <Drawer open={isOpen} onOpenChange={
      (isOpen) => {
        if (!isOpen) {
          form.reset();
        }
      }
    }>
      <DrawerTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Nuevo plan</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-start justify-center">
          <DrawerTitle>Cargar Plan</DrawerTitle>
          <DrawerDescription>Sube un plan de entreamiento.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-8 p-4"
          >
            <div className="flex flex-col justify-between gap-3 max-w-full">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="truncate">Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="truncate">Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field: {
                onChange,
                ...field
              } }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <FormControl>
                    <Input placeholder="Plan" type="file" onChange={
                      (e) => {
                        onChange(e);
                        handleUploadFile(e);
                      }
                    } {...field} />
                  </FormControl>
                  <FormDescription>
                    Sube un plan de entrenamiento en formato PNG, JPG, JPEG.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter className="p-0">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Subir"}
              </Button>
          <Button variant="outline" disabled={loading} onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
