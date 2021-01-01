import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReciptsPage } from './recipts.page';

describe('ReciptsPage', () => {
  let component: ReciptsPage;
  let fixture: ComponentFixture<ReciptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReciptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
