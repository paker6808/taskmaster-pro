import 'zone.js/testing';
import { LOCALE_ID  } from '@angular/core';
import { getTestBed, TestBed, TestModuleMetadata  } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

declare const require: any;

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Monkey-patch TestBed to always provide LOCALE_ID
const originalConfigureTestingModule = TestBed.configureTestingModule;
TestBed.configureTestingModule = function (moduleDef: TestModuleMetadata = {}) {
  moduleDef = moduleDef || {};
  moduleDef.providers = moduleDef.providers || [];
  
  // Only add LOCALE_ID if it hasn’t been added yet
  if (!moduleDef.providers.some(p => (p as any).provide === LOCALE_ID)) {
    moduleDef.providers.push({ provide: LOCALE_ID, useValue: 'en-US' });
  }

  return originalConfigureTestingModule.call(this, moduleDef);
};


// Find all tests
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
