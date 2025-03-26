import { inject } from '@angular/core';
import { ConfigService } from './services/config.service';

export function jsonInitializer(): () => Promise<void> {
  return () => inject(ConfigService).load();
}
