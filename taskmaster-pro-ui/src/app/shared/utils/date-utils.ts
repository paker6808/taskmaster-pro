export function toIsoMidnight(value: string | Date | null | undefined): string {
      if (!value) return '';
      let date: Date;
      
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === 'string') {
        // Expect dd.MM.yyyy if typed manually
        const parts = value.split('.');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // 0-based
          const year = parseInt(parts[2], 10);
          date = new Date(year, month, day);
        } else {
          // fallback
          date = new Date(value);
        }
      } else {
        return '';
      }

      if (isNaN(date.getTime())) return '';

      const utcMidnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      return utcMidnight.toISOString();
    }