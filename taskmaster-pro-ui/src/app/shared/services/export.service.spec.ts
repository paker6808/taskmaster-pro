import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapData', () => {
    it('should map basic data without headerMap', () => {
      const data: Record<string, any>[] = [{ id: '1', name: 'Test', value: 123 }];
      const mapped = (service as any).mapData(data);
      expect(mapped.length).toBe(1);
      expect(mapped[0].id).toBe('1');
      expect(mapped[0].name).toBe('Test');
      // number formatted for de-DE locale -> "123,00"
      expect(mapped[0].value).toBeDefined();
      expect(typeof mapped[0].value).toBe('string');
      expect(mapped[0].value).toMatch(/123[,\.]00/);
    });

    it('should apply headerMap', () => {
      const data: Record<string, any>[] = [{ id: '1', name: 'Test' }];
      const headerMap: Partial<Record<string, string>> = { name: 'Name Mapped' };
      const mapped = (service as any).mapData(data, headerMap);
      expect(mapped[0]['Name Mapped']).toBe('Test');
      expect(mapped[0]['id']).toBe('1');
    });

    it('should handle "0001-01-01T00:00:00" as empty string', () => {
      const data: Record<string, any>[] = [{ startDate: '0001-01-01T00:00:00' }];
      const mapped = (service as any).mapData(data);
      expect(mapped[0].startDate).toBe('');
    });

    it('should format ISO dates to a parseable string', () => {
      const iso = new Date().toISOString();
      const data: Record<string, any>[] = [{ created: iso }];
      const mapped = (service as any).mapData(data);
      expect(typeof mapped[0].created).toBe('string');
      // result should be parseable by Date
      const parsed = Date.parse(mapped[0].created);
      expect(isNaN(parsed)).toBeFalse();
    });

    it('should map userId to assignedTo if assignedTo present', () => {
      const data: Record<string, any>[] = [{ userId: 'u1', assignedTo: 'Alice' }];
      const mapped = (service as any).mapData(data);
      expect(mapped[0].userId).toBe('Alice');
    });
  });

  describe('exportToExcel', () => {
    beforeEach(() => {
      // fake anchor element and typed tag param
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        const fakeAnchor = {
          click: jasmine.createSpy('click'),
          href: '',
          download: ''
        } as unknown as HTMLAnchorElement;
        return fakeAnchor;
      });

      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      spyOn(window.URL, 'revokeObjectURL').and.callFake(() => {});
    });

    it('should not throw on empty data', () => {
      expect(() => service.exportToExcel([], 'empty')).not.toThrow();
    });

    it('should generate Excel for valid data', () => {
      const data: Record<string, any>[] = [{ id: '1', name: 'Test' }];
      expect(() => service.exportToExcel(data, 'TestFile')).not.toThrow();
    });

    it('should accept a headerMap and not throw', () => {
      const data: Record<string, any>[] = [{ id: '1', value: 100 }];
      const headerMap: Partial<Record<string, string>> = { value: 'Value Mapped' };
      expect(() => service.exportToExcel(data, 'TestFile', headerMap as any)).not.toThrow();
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        const fakeAnchor = {
          click: jasmine.createSpy('click'),
          href: '',
          download: ''
        } as unknown as HTMLAnchorElement;
        return fakeAnchor;
      });

      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      spyOn(window.URL, 'revokeObjectURL').and.callFake(() => {});
    });

    it('should generate CSV for valid data', () => {
      const data: Record<string, any>[] = [{ id: '1', name: 'CSV Test' }];
      expect(() => service.exportToCSV(data, 'CSVFile')).not.toThrow();
    });

    it('should apply headerMap in CSV and not throw', () => {
      const data: Record<string, any>[] = [{ id: '1', value: 123 }];
      const headerMap: Partial<Record<string, string>> = { value: 'Value Mapped' };
      expect(() => service.exportToCSV(data, 'CSVFile', headerMap as any)).not.toThrow();
    });
  });
});
