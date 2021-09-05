import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export interface IFrame {
  first: string;
  second: string;
}

export interface IFrameCounter {
  frames: IFrame[];
}

export interface IStrikeAndSpare {
  isStrike: boolean;
  isSpare: boolean;
}

type FrameControls = { [key in keyof IFrame]: AbstractControl };
type FrameForm = FormGroup & { value: IFrame; controls: FrameControls };

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {
  roundForm!: FrameForm;
  framesCounter: IFrameCounter = { frames: [] };
  framesObject: IFrameCounter = { frames: [] };
  score = new BehaviorSubject<number>(0);

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.roundForm = new FormGroup({
      first: new FormControl('0', [Validators.required]),
      second: new FormControl('0'),
    } as FrameControls) as FrameForm;
  }

  onSubmit(): void {
    this.score.next(
      this.getTotalScore(this.roundForm.value, this.framesCounter)
    );
    const framesNumber = this.framesCounter.frames.length;
    const { first, second } = this.roundForm.value;
    const { isStrike, isSpare } = this.getStrikeAndSpare(first, second);
    if (framesNumber === 10 && !isStrike) {
      isSpare
        ? this.roundForm.controls.second.disable()
        : (this.framesCounter = { frames: [] });
    }
    if (framesNumber === 11) {
      this.roundForm.controls.second.enable();
      this.framesCounter = { frames: [] };
    }

    this.initForm();
  }

  calculate(jsonFrames: string): string {
    const framesObj: IFrameCounter = JSON.parse(jsonFrames);
    console.log(jsonFrames);
    const { score, first, second } = framesObj.frames.reduce(
      (
        total: { score: number; first: string; second: string },
        { first, second }
      ) => {
        const currentFirst = parseInt(first);
        const currentSecond = parseInt(second);
        const { isStrike, isSpare } = this.getStrikeAndSpare(
          total.first,
          total.second
        );
        if (isStrike || isSpare) {
          return {
            first,
            second,
            score: isStrike
              ? total.score + (currentFirst + currentSecond) * 2
              : total.score + currentSecond + currentFirst * 2,
          };
        }
        return {
          score: total.score + currentFirst + currentSecond,
          first,
          second,
        };
      },
      { score: 0, first: '0', second: '0' }
    );

    return JSON.stringify({ score });
  }

  getTotalScore(formValue: IFrame, counter: IFrameCounter): number {
    counter.frames.push(formValue);
    const jsonScore = this.calculate(JSON.stringify(counter));
    return JSON.parse(jsonScore).score;
  }

  getStrikeAndSpare(first: string, second: string): IStrikeAndSpare {
    const firstNumber = parseInt(first);
    const secondNumber = parseInt(second);
    const isStrike = firstNumber === 10;
    const isSpare = firstNumber !== 10 && firstNumber + secondNumber === 10;
    return { isStrike, isSpare };
  }
}
