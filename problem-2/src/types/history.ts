import { formSchema } from "@/types/crypto";
import { z } from "zod";

export interface HistoryProps extends z.infer<typeof formSchema> {
  date: Date;
}