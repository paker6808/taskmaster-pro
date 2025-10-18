import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToExcel<T extends Record<string, any>>(
    data: T[],
    fileName: string,
    headerMap?: Record<keyof T, string>)
  {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Map headers if provided
    const mappedData = this.mapData(data, headerMap);

    // Generate worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);

    // Auto column widths (header + content)
    const colWidths = Object.keys(mappedData[0]).map(key => {
    const maxContentLength = Math.max(
        key.length,
        ...mappedData.map(row => (row[key] ? row[key].toString().length : 0))
    );
    return { wch: Math.max(maxContentLength, 15) };
    });
    ws['!cols'] = colWidths;

    // Create workbook and append sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToCSV<T extends Record<string, any>>(
    data: T[],
    fileName: string,
    headerMap?: Partial<Record<keyof T, string>>)
  {
    // Map headers if provided
    const mappedData = this.mapData(data, headerMap);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData, { skipHeader: false });
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ',', RS: '\n' });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private mapData<T extends Record<string, any>>(
    data: T[],
    headerMap?: Partial<Record<keyof T, string>>
  ): Record<string, any>[] {
    return data.map(item => {
      const mapped: Record<string, any> = {};

      for (const key in item) {
        if (!Object.prototype.hasOwnProperty.call(item, key)) continue;

        let value = (item as any)[key];

        // Handle "0001-01-01T00:00:00"
        if (typeof value === 'string' && value.startsWith('0001-01-01')) {
          value = '';
        }

        // Format ISO dates
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value)) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            // Date-only fields
            if (key === 'orderDate' || key === 'scheduledStart' || key === 'scheduledEnd') {
              value = date.toLocaleDateString(); // e.g., 18.10.2025
            } else {
              value = date.toLocaleString(); // full date + time for created/updated etc.
            }
          }
        }

        // Format numbers (except IDs) with German locale
        if (typeof value === 'number' && key !== 'id') { 
          value = value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Special case for userId to assignedTo mapping
        if (key === 'userId' && (item as any).assignedTo) {
          value = (item as any).assignedTo;
        }

        // Apply header map if provided
        const newKey = headerMap?.[key as keyof T] ?? key;
        mapped[newKey] = value;
      }

      return mapped;
    });
  }
}
