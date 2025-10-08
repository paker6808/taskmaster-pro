import { UrlTree } from '@angular/router';
import { NavigationExtras } from '@angular/router';

export class RouterStub {
  public navigatedTo: any;
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    this.navigatedTo = { commands, extras };
    return Promise.resolve(true);
  }

  createUrlTree(_commands: any[], _extras?: NavigationExtras): UrlTree {
    return {} as UrlTree;
  }
}

export function createActivatedRouteSnapshot(
  params: Record<string, string> = {},
  queryParams: Record<string, string> = {}
): any {
  return {
    snapshot: {
      paramMap: {
        get: (key: string): string | null => params.hasOwnProperty(key) ? params[key] : null
      },
      queryParamMap: {
        get: (key: string): string | null => queryParams.hasOwnProperty(key) ? queryParams[key] : null
      }
    }
  };
}

export class MatDialogRefStub {
  afterClosedValue: any;
  constructor(value: any) {
    this.afterClosedValue = value;
  }
  afterClosed() {
    return {
      subscribe: (cb: (res: any) => void) => cb(this.afterClosedValue)
    };
  }
}

export class MatDialogStub {
  returnValue: any = null;
  open(): MatDialogRefStub {
    return new MatDialogRefStub(this.returnValue);
  }
}
