import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusBadge } from './order-status-badge';

describe('OrderStatusBadge', () => {
  let component: OrderStatusBadge;
  let fixture: ComponentFixture<OrderStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
