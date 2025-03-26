import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { AppConfig } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config!: AppConfig;
  private competences: string[] = [];

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<AppConfig>('/config.json')
    );
  }

  getConfig(): AppConfig {
    return this.config;
  }
}
