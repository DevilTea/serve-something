export interface ServeSpaOptions {
  root: string;
  prefix?: string;
  spaFallback?: boolean;
}

export interface BuildExecutableOptions extends ServeSpaOptions {
  name: string;
  outpath: string;
  targets: string;
}