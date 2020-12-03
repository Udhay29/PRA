export class ListingFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: object;
  inputFlag: boolean;
  isToggleHidden: boolean;
}
export class StatusInterface {
  title: string;
  callback?: object;
  url?: string;
  isToggleHidden: boolean;
  expanded?: boolean;
}
