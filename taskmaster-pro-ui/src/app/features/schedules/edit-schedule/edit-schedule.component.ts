import { ChangeDetectorRef , Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MaterialModule } from '../../../shared/modules/material.module';
import { UpdateScheduleDto } from '../../../shared/models/schedule';
import { UserDto } from '../../../shared/models/user.dto';
import { AuthService } from '../../authentication/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { UserService } from '../../users/user.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, take, tap, finalize } from 'rxjs/operators';
import { toIsoMidnight } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-edit-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit, OnDestroy {
  editForm!: FormGroup;
  isSubmitting = false;
  scheduleId!: string;
  private destroy$ = new Subject<void>();
  @ViewChild('userAuto') userAuto!: MatAutocomplete;

  // Typeahead
  orderSuggestions$: Observable<any[]> = of([]);
  userSuggestions$: Observable<UserDto[]> = of([]);
  validatingOrder = false;
  isOrderValid = false;
  validatingAssigned = false;

  // Typeahead/search config
  searchMinLength = 3;
  searchTooShortOrder = false;
  searchTooShortUser  = false;

  // Clipboard support detection
  clipboardSupported = !!(navigator && (navigator as any).clipboard && (navigator as any).clipboard.readText && (navigator as any).clipboard.writeText);

  // Cache for quick display lookup of users by ID
  private userCache = new Map<string, UserDto>();
  selectedUser: UserDto | null = null;

  // Current user info
  isAdmin = false;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private orderService: OrderService,
    private scheduleService: ScheduleService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.editForm = this.fb.group({
      orderId:        ['', Validators.required],
      title:          ['', [Validators.required, Validators.maxLength(250)]],
      scheduledStart: [new Date(), [Validators.required, this.startNotBeforeMidnightValidator]],
      scheduledEnd:   [new Date(), Validators.required],
      description:    ['', [Validators.required, Validators.maxLength(1000)]],
      assignedTo:     [null]   
      }, { validators: this.endAfterStartValidator(this.nextMidnight) });

    // Server-side autocomplete for users: debounce + minimum lengthes
    this.userSuggestions$ = this.editForm.get('assignedTo')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(val => {
        const str = (val || '').toString().trim();
        if (str.length < this.searchMinLength) {
          this.searchTooShortUser = true;
          return of([]);
        }
        this.searchTooShortUser = false;
        return this.userService.searchUsers(str).pipe(
          tap(list => list.forEach(u => this.userCache.set(u.id, u))),
          catchError(() => of([]))
        );
      })
    );

    // Initialize Current User / Role
    this.authService.isAdmin$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
      this.scheduleId = this.route.snapshot.paramMap.get('id')!;

      // Get the schedule with the id provided in the route
      this.scheduleService.getById(this.scheduleId).pipe(
        takeUntil(this.destroy$)
      ).subscribe(schedule => {
        this.editForm.patchValue(schedule);
          if (schedule.assignedTo) {
          if (typeof schedule.assignedTo === 'string') {
            // assignedTo is an id — fetch user object for display
            this.userService.getById(schedule.assignedTo).pipe(
              takeUntil(this.destroy$),
              catchError(()=>of(null)),
              take(1)
            ).subscribe(u => {
                if (u) {
                  this.selectedUser = u;
                  this.assignedTo.setValue(u.id);
                  this.cdr.detectChanges();
                }
              });
          } else {
            // assignedTo is object already
            this.selectedUser = schedule.assignedTo;
            this.assignedTo.setValue(this.selectedUser.id);
            this.cdr.detectChanges();
          }
        }
      });

      // Disable the assignedTo control for non-admin users
      if (!this.isAdmin) this.assignedTo.disable({ emitEvent: false });
        else this.assignedTo.enable({ emitEvent: false });

      // If there is a currentUserId, fetch the user object and set selectedUser
      if (this.currentUserId) {
        this.userService.getById(this.currentUserId).pipe(
          takeUntil(this.destroy$),
          catchError(() => of(null))
        ).subscribe(u => {
          if (u) {
            this.userCache.set(u.id, u);
            this.selectedUser = u;
            // set id silently and force change detection
            this.assignedTo.setValue(u.id, { emitEvent: false });
            this.cdr.detectChanges();
          }
        });
      }

      // Prefill orderId from query param (if present)
      const q = this.route.snapshot.queryParamMap.get('orderId');
      if (q) {
        this.orderId.setValue(q);
        this.validateOrderId(q);
      }

      // Server-side autocomplete for orders: debounce + minimum length
      this.orderSuggestions$ = this.orderId.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(val => {
          const str = val?.toString().trim() || '';
          if (str.length < this.searchMinLength) {
            this.searchTooShortOrder = true; // show warning in template
            return of([]);
          } else {
            this.searchTooShortOrder = false;
            return this.orderService.searchOrders(str).pipe(
              catchError(() => of([]))
            );
          }
        })
      );

      // Validate on pause/blur-ish behavior: when value stabilizes, check existence
      this.orderId.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(700),
        distinctUntilChanged(),
        tap(val => {
          // Reset validation display until proven
          this.isOrderValid = false;
          this.validatingOrder = true;             // <-- Show spinner/hint while checking
          if (!val || val.toString().trim().length === 0) {
            this.editForm.get('orderId')?.setErrors({ required: true });
            this.validatingOrder = false;         // Stop validating if empty
          }
        }),
        switchMap(val => {
          if (!val || val.toString().trim().length === 0) return of(null);
          return this.orderService.exists(val.toString()).pipe(
            catchError(() => of(false))
          );
        })
      ).subscribe(result => {
        if (result === null) {
          // Nothing to do
          this.validatingOrder = false;
          return;
        }
        this.validatingOrder = false;
        if (result === true) {
          this.isOrderValid = true;
          // Clear notFound error if any
          const ctrl = this.editForm.get('orderId');
          if (ctrl?.hasError('notFound')) ctrl.setErrors(null);
        } else {
          this.isOrderValid = false;
          this.editForm.get('orderId')?.setErrors({ notFound: true });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async submit() {
    // Force assignedTo validation
    const assignedValid = await this.validateAssignedTo(this.assignedTo.value);
    
    if (!assignedValid) {
      this.notification.show('Assigned To is invalid or not found.', 'Close');
      this.editForm.markAllAsTouched();
      return;
    }

    // Prevent multiple submits
    if (this.editForm.invalid) {
      // Mark touched so mat-error appears
      this.editForm.markAllAsTouched();
      return;
    }

    // Final check: ensure order id validated
    if (!this.isOrderValid) {
      this.notification.show('Order ID is invalid or not found.', 'Close');
      return;
    }

    // Extract assignedToId from assignedTo property
    const assignedValue = this.editForm.value.assignedTo;
    const assignedToId = this.isAdmin
      ? (assignedValue && typeof assignedValue === 'object' ? assignedValue.id : assignedValue)
      : this.currentUserId;
  
    this.isSubmitting = true;
    const dto: UpdateScheduleDto = {
      id:             this.scheduleId,
      orderId:        this.editForm.value.orderId,
      title:          this.editForm.value.title,
      scheduledStart: toIsoMidnight(this.editForm.value.scheduledStart),
      scheduledEnd:   toIsoMidnight(this.editForm.value.scheduledEnd),
      description:    this.editForm.value.description,
      assignedToId:     assignedToId
    };

    this.scheduleService.update(this.scheduleId, dto).subscribe({
      next: () => {
        this.notification.show('Schedule edited!');
        this.router.navigate(['/schedules']);
      },
      error: () => {
        this.notification.show('Failed to edit schedule', 'Close');
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/schedules']);
  }

  // Called when the user selects an autocomplete option for Order ID
  onOrderSelected(orderId: string) {
    this.orderId.setValue(orderId);
    this.validateOrderId(orderId);
  }

  // Validate single Order ID on-demand (called after paste or explicit action)
  validateOrderId(id: string) {
    if (!id) return;
    this.validatingOrder = true;
    this.orderService.exists(id).pipe(
      takeUntil(this.destroy$),
      catchError(() => of(false))
    ).subscribe(exists => {
      this.validatingOrder = false;
      this.isOrderValid = !!exists;
      if (!exists) {
        this.editForm.get('orderId')?.setErrors({ notFound: true });
      } else {
        // clear errors
        const ctrl = this.editForm.get('orderId');
        if (ctrl?.hasError('notFound')) ctrl.setErrors(null);
      }
    });
  }

  // Display helper for user autocomplete
  displayUser(userId: string | null): string {
    if (!userId) return '';
    const u = this.userCache.get(userId) || (this.selectedUser && this.selectedUser.id === userId ? this.selectedUser : null);
    if (!u) return '';
    return `${u.email} - ${u.fullName || u.displayName || ''}`.trim();
  }

  // Called when the user selects an autocomplete option for Assigned To
  onUserSelected(userId: string) {
    const user = this.userCache.get(userId);
    if (user) {
      this.selectedUser = user;
      // set primitive ID in control, triggers valueChanges
      this.assignedTo.setValue(user.id);
      this.validateAssignedTo(user.id);
    } else {
      // fallback: control already has id, validate it
      this.assignedTo.setValue(userId);
      this.validateAssignedTo(userId);
    }
    this.cdr.detectChanges();
  }

  // Validate single Assigned To on-demand (called after paste or explicit action)
  validateAssignedTo(val: string | UserDto | null): Promise<boolean> {
    return new Promise(resolve => {
      let id = '';
      if (!val) { resolve(false); return; }
      if (typeof val === 'string') id = val.trim();
      else id = (val as UserDto).id;
      if (!id) { resolve(false); return; }

      this.validatingAssigned = true;
      this.userService.exists(id).pipe(
        takeUntil(this.destroy$),
        catchError(() => of(false)),
        finalize(() => this.validatingAssigned = false)
      ).subscribe(exists => {
        const ctrl = this.editForm.get('assignedTo');
        if (!exists) ctrl?.setErrors({ notFound: true });
        else ctrl?.updateValueAndValidity({ onlySelf: true });
        resolve(exists);
      });
    });
  }

  // Optional Paste helper (permission required on some browsers). Graceful fallback to notification.
  async pasteFromClipboard() {
    if (!this.clipboardSupported) {
      this.notification.show('Clipboard not supported in this browser.', 'Close');
      return;
    }
    try {
      const text = await (navigator as any).clipboard.readText();
      if (!text) {
        this.notification.show('Clipboard is empty.', 'Close');
        return;
      }
      this.orderId.setValue(text.trim());
      this.validateOrderId(text.trim());
    } catch (err) {
      this.notification.show('Could not read clipboard (permission denied).', 'Close');
    }
  }
  
  startNotBeforeMidnightValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    const date = new Date(value);
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next day 00:00
    return date >= midnight ? null : { beforeMidnight: true };
  }

  endAfterStartValidator(min: Date) {
    return (group: FormGroup) => {
      const startCtrl = group.get('scheduledStart');
      const endCtrl = group.get('scheduledEnd');

      if (!startCtrl || !endCtrl) return null;

      const s = startCtrl.value ? new Date(startCtrl.value) : null;
      const e = endCtrl.value ? new Date(endCtrl.value) : null;

      if (!s || !e) return null;

      const errors = endCtrl.errors || {};

      if (e <= s || e < min) {
        errors['endBeforeStart'] = true;
        endCtrl.setErrors(errors);
      } else {
        if (errors['endBeforeStart']) {
          delete errors['endBeforeStart'];
          endCtrl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return null;
    };
  }

  addOneDay(date: Date | string): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }

  // Getters for form controls
  get orderId() {
    return this.editForm.get('orderId')!;
  }
  get title() {
    return this.editForm.get('title')!;
  }
  get scheduledStart() {
    return this.editForm.get('scheduledStart')!;
  }
  get scheduledEnd() {
    return this.editForm.get('scheduledEnd')!;
  }
  get description() {
    return this.editForm.get('description')!;
  }
  get assignedTo()  {
    return this.editForm.get('assignedTo')!;
  }
  get nextMidnight(): Date {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next day 00:00
    return midnight;
  }
}