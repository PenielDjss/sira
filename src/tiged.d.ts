declare module 'tiged' {
  interface TigedOptions {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: 'tar' | 'git';
  }

  interface TigedEmitter {
    clone(dest: string): Promise<void>;
    on(event: string, handler: (...args: any[]) => void): this;
    remove(): Promise<void>;
  }

  function tiged(src: string, opts?: TigedOptions): TigedEmitter;

  export = tiged;
}

// Made with Bob
