export class OpenIframe {
  static readonly type = '[Iframe Page] open';
  constructor(public url: string) {}
}

export class CloseIframe {
  static readonly type = '[Iframe Page] close';
  constructor() {}
}

export class ToggleIframe {
  static readonly type = '[Iframe Page] toggle';
  constructor() {}
}
