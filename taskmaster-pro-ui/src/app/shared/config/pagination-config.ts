import { InjectionToken } from '@angular/core';

export const PAGE_SIZE_OPTIONS = new InjectionToken<number[]>('PAGE_SIZE_OPTIONS');
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];