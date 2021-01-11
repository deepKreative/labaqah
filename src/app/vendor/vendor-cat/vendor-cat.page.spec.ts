import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorCatPage } from './vendor-cat.page';

describe('VendorCatPage', () => {
  let component: VendorCatPage;
  let fixture: ComponentFixture<VendorCatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorCatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
