import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form', () => {
    const formElement =
      fixture.debugElement.nativeElement.querySelector('.calculator-form');
    expect(formElement).toBeTruthy();
  });

  it('check initial form values', () => {
    const roundForm = component.roundForm;
    const roundFormValues = {
      first: '0',
      second: '0',
    };
    expect(roundForm.value).toEqual(roundFormValues);
  });

  it('check validation work', () => {
    const first = component.roundForm.controls.first;
    first.setValue(14);
    expect(first.hasError('pattern')).toBeTruthy();
    first.setValue('');
    expect(first.hasError('required')).toBeTruthy();
    first.setValue(10);
    expect(first.valid).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    spyOn(component, 'onSubmit');
    const button = fixture.debugElement.nativeElement.querySelector(
      '.calculator-form button'
    );
    button.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('#getStrikeAndSpare should return "{"isStrike": true,"isSpare": false}"', () => {
    const first: string = '10';
    const second: string = '0';
    const func = component.getStrikeAndSpare(first, second);
    expect(func).toEqual({ isStrike: true, isSpare: false });
  });

  it('#getStrikeAndSpare should return "{"isStrike": false,"isSpare": true}"', () => {
    const first: string = '4';
    const second: string = '6';
    const func = component.getStrikeAndSpare(first, second);
    expect(func).toEqual({ isStrike: false, isSpare: true });
  });

  it('#calculate should return "{"score":0}"', () => {
    const jsonFrames: string = `{"frames":[{"first":"0","second":"0"},{"first":"0","second":"0"}]}`;
    const calc = component.calculate(jsonFrames);
    expect(calc).toBe(`{"score":0}`);
  });

  it('#calculate should return "{"score":30}"', () => {
    const jsonFrames: string = `{"frames":[{"first":"10","second":"0"},{"first":"4","second":"6"}]}`;
    const calc = component.calculate(jsonFrames);
    expect(calc).toBe(`{"score":30}`);
  });

  it('#calculate should return "{"score":43}"', () => {
    const jsonFrames: string = `{"frames":[{"first":"5","second":"0"},{"first":"7","second":"3"},{"first":"1","second":"0"},{"first":"10","second":"0"},{"first":"8","second":"0"}]}`;
    const calc = component.calculate(jsonFrames);
    expect(calc).toBe(`{"score":43}`);
  });

  it('#getTotalScore should return 0', () => {
    const framesCounter = {
      frames: [{ first: '0', second: '0' }],
    };
    const formValue = { first: '0', second: '0' };
    const getScore = component.getTotalScore(formValue, framesCounter);
    expect(getScore).toBe(0);
  });

  it('#getTotalScore should return 30', () => {
    const framesCounter = {
      frames: [{ first: '10', second: '0' }],
    };
    const formValue = { first: '4', second: '6' };
    const getScore = component.getTotalScore(formValue, framesCounter);
    expect(getScore).toBe(30);
  });

  it('#calculate should return 43', () => {
    const framesCounter = {
      frames: [
        { first: '5', second: '0' },
        { first: '7', second: '3' },
        { first: '1', second: '0' },
        { first: '10', second: '0' },
      ],
    };
    const formValue = { first: '8', second: '0' };
    const getScore = component.getTotalScore(formValue, framesCounter);
    expect(getScore).toBe(43);
  });
});
