export interface IframePageModel {
  url: string;
  isOpen: boolean;
  isChanged?: boolean;
}

export const EMPTY_IFRAME_PAGE = {
  url: null,
  isOpen: false,
};
