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
import { useState } from "react";

interface ExchangeHistoryTableProps {
  historyData: HistoryProps[];
}

const ExchangeHistoryTable = ({ historyData }: ExchangeHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = historyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
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
                <TableCell>{history.exchangeValue}$</TableCell>
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
              onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(historyData.length / itemsPerPage)))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ExchangeHistoryTable;
