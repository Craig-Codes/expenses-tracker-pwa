import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReciptsEditPage } from './recipts-edit.page';

describe('ReciptsEditPage', () => {
  let component: ReciptsEditPage;
  let fixture: ComponentFixture<ReciptsEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptsEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReciptsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
