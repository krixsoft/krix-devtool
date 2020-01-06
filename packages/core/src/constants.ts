import * as Enums from './enums';

export const AppName: 'Krix-DevTool' = `Krix-DevTool`;

const EndpointSeparator: string = `_`;

export const CSToBgSConnectionName: string = Enums.AppEndpoint.ContentScript
  + EndpointSeparator + Enums.AppEndpoint.BackgroundScript;

export const DTAToBgSConnectionName: string = Enums.AppEndpoint.DevToolApp
  + EndpointSeparator + Enums.AppEndpoint.BackgroundScript;
