import { HttpError } from '../api/searchCountries.js';

export type SearchErrorKind = 'aborted' | 'timeout' | 'http' | 'network';

export interface ClassifiedError {
  kind: SearchErrorKind;
  isUserError: boolean;
  message: string;
}

export function classifySearchError(error: unknown): ClassifiedError {
  if (error instanceof DOMException || error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        kind: 'aborted',
        isUserError: false,
        message: '',
      };
    }

    if (error.name === 'TimeoutError') {
      return {
        kind: 'timeout',
        isUserError: true,
        message:
          'Превышено время ожидания ответа от сервера. Попробуйте ещё раз.',
      };
    }
  }

  if (error instanceof HttpError) {
    return {
      kind: 'http',
      isUserError: true,
      message: `Ошибка сервера (код ${error.status}). Попробуйте повторить запрос.`,
    };
  }

  return {
    kind: 'network',
    isUserError: true,
    message:
      'Ошибка сети. Проверьте подключение к интернету и повторите попытку.',
  };
}
