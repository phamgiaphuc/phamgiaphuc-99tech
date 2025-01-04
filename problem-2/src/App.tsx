import { Input } from "@/components/ui/input";
import { ArrowRight, BuyCrypto, DollarCircle, Timer } from "iconsax-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputIcon from "@/components/ui/input-icon";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { currencyData, formSchema } from "@/types/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HistoryProps } from "@/types/history";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const App = () => {
  const { toast } = useToast();
  const [historyData, setHistoryData] = useState<HistoryProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exchangeValue: 0,
      currency: "BLUR",
      result: 0,
    },
  });

  const onSaveHistory = useCallback((values: z.infer<typeof formSchema>) => {
    const history = localStorage.getItem("history");
    const newHistory = history ? JSON.parse(history) : [];
    newHistory.unshift({
      ...values,
      date: new Date().toISOString(),
    });
    setHistoryData(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  }, []);

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (values.exchangeValue < 0) {
        toast({
          variant: "destructive",
          title: "Oops! Something went wrong",
          description: "Value cannot be negative",
        });
        return;
      }
      const currency = currencyData.find((currency) => currency.currency === values.currency);
      if (!currency) {
        toast({
          variant: "destructive",
          title: "Oops! Something went wrong",
          description: "Currency not found",
        });
        return;
      }
      const result = (values.exchangeValue / currency.price).toFixed(2);
      form.setValue("result", parseFloat(result));
      values.result = parseFloat(result);
      onSaveHistory(values);
    },
    [form, onSaveHistory, toast]
  );

  useEffect(() => {
    const history = localStorage.getItem("history");
    if (history) {
      setHistoryData(JSON.parse(history) as HistoryProps[]);
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = historyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex gap-2 mb-8">
        <p className="text-2xl capitalize">Crypto currency converter</p>
        <BuyCrypto size={32} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-screen-sm w-full">
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="exchangeValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      startIcon={<DollarCircle />}
                      className="h-12 w-[12rem] bg-white rounded-xl focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Value"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ArrowRight />
            <div className="flex w-full">
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <Input
                    className="h-12 w-full rounded-xl bg-white rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    placeholder="Exchange value"
                    readOnly
                    value={`${field.value.toFixed(2)} (${form.getValues("currency")})`}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("result", 0);
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[9rem] bg-white h-12 rounded-xl rounded-l-none -ml-[1px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white">
                        {currencyData.map((currency) => (
                          <SelectItem key={currency.currency} value={currency.currency}>
                            <div className="flex items-center gap-2">
                              <img src={currency.image_url} alt={currency.currency} className="w-5 h-5" />
                              <p>{currency.currency}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl shadow-md">
            Convert
          </Button>
        </form>
      </Form>
      <div className="max-w-screen-sm bg-white shadow-md rounded-xl mt-4 w-full flex flex-col items-center">
        <p className="px-2 py-4 font-medium flex gap-1 text-sm items-center">
          <Timer size={18} />
          Exchange history
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Exchange value ($)</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No history found
                </TableCell>
              </TableRow>
            )}
            {paginatedData.length > 0 &&
              paginatedData.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{history.exchangeValue.toFixed(2)}$</TableCell>
                  <TableCell>{`${history.result.toFixed(2)} (${history.currency})`}</TableCell>
                  <TableCell className="text-right">{new Date(history.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Pagination className="py-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: Math.ceil(historyData.length / itemsPerPage) }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, Math.ceil(historyData.length / itemsPerPage)))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default App;