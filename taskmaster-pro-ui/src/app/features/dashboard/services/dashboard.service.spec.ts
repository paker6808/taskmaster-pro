import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardService } from '../services/dashboard.service';
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { dashboardStatsEmptyMock, dashboardStatsMock } from '../../../shared/mock-data';

describe('DashboardService & DashboardComponent (integration-style unit tests)', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let dashboardService: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DashboardComponent,
        NgChartsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [DashboardService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ------------------------
  // SERVICE: HTTP behaviour
  // ------------------------
  it('service: should be created', () => {
    expect(dashboardService).toBeTruthy();
  });

  it('service: GET stats without year', (done) => {
    dashboardService.getStats().subscribe(res => {
      expect(res).toEqual(dashboardStatsMock);
      done();
    });

    const req = httpMock.expectOne(request => request.url.endsWith('/Dashboard/stats'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('year')).toBeNull();
    req.flush(dashboardStatsMock);
  });

  it('service: GET stats with year query param', (done) => {
    const year = 2040;

    dashboardService.getStats(year).subscribe(res => {
      expect(res).toEqual(dashboardStatsMock);
      done();
    });

    const req = httpMock.expectOne(request =>
      request.url.endsWith('/Dashboard/stats') && request.params.get('year') === year.toString()
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('year')).toBe(year.toString());
    req.flush(dashboardStatsMock);
  });

  it('service: handle empty response shape', (done) => {
    dashboardService.getStats().subscribe(res => {
      expect(res.totalOrders).toBe(0);
      expect(Array.isArray(res.monthlyOrders)).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(request => request.url.endsWith('/Dashboard/stats'));
    req.flush(dashboardStatsEmptyMock);
  });

  it('service: propagate http errors', (done) => {
    const errorMsg = 'simulated network error';

    dashboardService.getStats().subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err.statusText).toBe(errorMsg);
        done();
      }
    });

    const req = httpMock.expectOne(request => request.url.endsWith('/Dashboard/stats'));
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: errorMsg });
  });

  // ------------------------
  // COMPONENT: lifecycle + mapping
  // ------------------------
  it('component: should create', () => {
    expect(component).toBeTruthy();
  });

  it('component: ngOnInit builds labels and calls service (success path)', () => {
    // replace actual HTTP call by spying on service method
    spyOn(dashboardService, 'getStats').and.returnValue(of(dashboardStatsMock));

    // trigger ngOnInit + loadDashboard
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.totalOrders).toBe(10);
    expect(component.totalSchedules).toBe(5);
    expect(component.totalUsers).toBe(3);

    const months = component.barChartLabels.length;
    expect((component.barChartData.datasets[0].data as number[]).length).toBe(months);
    expect((component.barChartData.datasets[1].data as number[]).length).toBe(months);

    // mapped values
    expect((component.barChartData.datasets[0].data as number[])[0]).toBe(2); // Jan orders
    expect((component.barChartData.datasets[1].data as number[])[1]).toBe(3); // Feb schedules
  });

  it('component: ngOnInit handles service error (sets isLoading false)', () => {
    spyOn(dashboardService, 'getStats').and.returnValue(throwError(() => ({ status: 500 })));

    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.totalOrders).toBe(0);
    expect(component.totalSchedules).toBe(0);
    expect(component.totalUsers).toBe(0);
  });
});
