// import { AppSettings } from "./app-settings.model";
import { AppSettingsService } from "./app-settings.service";

export function preloadAppSettings(
  configService: AppSettingsService
  // ): () => Promise<AppSettings> {
): () => Promise<any> {
  // return (): Promise<AppSettings> => configService.initialize();
  return (): Promise<any> => configService.initialize();
}
