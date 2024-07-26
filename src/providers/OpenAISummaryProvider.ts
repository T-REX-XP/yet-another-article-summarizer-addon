import axios, { Axios } from 'axios';
import { ISummaryProvider } from '../interfaces/ISummaryProvider';
import { ISummaryResponse } from '@src/interfaces/ISummaryResponse';

export interface IOpenAISummaryProviderOptions {
  apiKey: string;
  model: string;
}
class OpenAISummaryProvider implements ISummaryProvider {
  private options: IOpenAISummaryProviderOptions;
  private apiClient: Axios;
  constructor(options: IOpenAISummaryProviderOptions) {
    this.options = options;
    this.apiClient = new Axios(
      {
        baseURL: "https://api.openai.com/v1/",
        headers: {
          'Authorization': `Bearer ${this.options.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
  }
  public async summarizeArticle(articleText: string | null): Promise<ISummaryResponse> {
    try {
      //endpoint, data, config
      return await this.apiClient.post(
        'chat/completions',
        JSON.stringify({
          messages: [
            {
              "role": "system",
              "content": `You are an assistant that summaryzing articles and web pages.
                Summarize all articles without confirmation and answer. The result must be in the following json format {"summary":"","sentiment":"","topics":"topic1,topic2,etc.."}`
            },
            {
              role: "user",
              content: `${articleText}`
            }
          ],
          model: this.options.model
        })
      ).then(response => JSON.parse(response.data))
        .then(data => data.choices[0].message?.content?.trim())
        .then(content=> JSON.parse(content));
    } catch (error: any) {
      return Promise.reject('An error occurred while summarizing the article.' + error);
    }
  }
}
export default OpenAISummaryProvider;