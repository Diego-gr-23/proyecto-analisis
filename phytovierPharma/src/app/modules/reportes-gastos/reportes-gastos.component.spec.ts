import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesGastosComponent } from './reportes-gastos.component';

describe('ReportesGastosComponent', () => {
  let component: ReportesGastosComponent;
  let fixture: ComponentFixture<ReportesGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
