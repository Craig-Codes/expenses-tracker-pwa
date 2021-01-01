import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReciptNewPage } from './recipt-new.page';

describe('ReciptNewPage', () => {
  let component: ReciptNewPage;
  let fixture: ComponentFixture<ReciptNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReciptNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
