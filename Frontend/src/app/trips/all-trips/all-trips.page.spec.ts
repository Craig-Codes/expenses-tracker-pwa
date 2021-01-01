import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllTripsPage } from './all-trips.page';

describe('AllTripsPage', () => {
  let component: AllTripsPage;
  let fixture: ComponentFixture<AllTripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTripsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
