import { z } from "zod";

export const DataDTO = z.object({
	city: z.string().describe("The city name"),
});
