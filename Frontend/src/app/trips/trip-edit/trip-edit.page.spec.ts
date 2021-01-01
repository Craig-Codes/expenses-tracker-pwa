import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripEditPage } from './trip-edit.page';

describe('TripEditPage', () => {
  let component: TripEditPage;
  let fixture: ComponentFixture<TripEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
