import { ISummaryResponse } from "./ISummaryResponse";

export interface ISummaryProvider{
    summarizeArticle(articleText: string | null): Promise<ISummaryResponse>;
}
export default ISummaryProvider;