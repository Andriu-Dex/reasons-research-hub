import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('splashFade', [
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      state('hidden', style({ opacity: 0, transform: 'scale(0.95)' })),
      transition('visible => hidden', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(1.05)' }))
      ]),
      transition('hidden => visible', [
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('letterBounce', [
      transition(':enter', [
        query(':enter', [
          style({ transform: 'translateY(20px) scale(0.3)' }),
          stagger('70ms', [
            animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulseGlow', [
      state('active', style({ opacity: 1, transform: 'scale(1)' })),
      transition('active => inactive', [
        animate('800ms ease-in-out', style({ opacity: 0, transform: 'scale(0.8)' }))
      ]),
      transition('inactive => active', [
        animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('loaderDash', [
      state('running', style({ strokeDashoffset: 0 })),
      transition('void => running', [
        animate('1500ms linear', keyframes([
          style({ strokeDashoffset: 283, offset: 0 }),
          style({ strokeDashoffset: 0, offset: 0.5 }),
          style({ strokeDashoffset: -283, offset: 1 })
        ]))
      ])
    ]),
    trigger('dotsBounce', [
      transition('* => *', [
        animate('600ms ease-in-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-8px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
  ],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent implements OnInit {
  visible = true;
  loaded = false;
  dismissed = false;
  letters: string[] = [];

  ngOnInit(): void {
    const word = 'REASONS';
    this.letters = word.split('');
    
    setTimeout(() => {
      this.loaded = true;
    }, 700);

    setTimeout(() => {
      this.visible = false;
    }, 1200);

    setTimeout(() => {
      this.dismissed = true;
    }, 1750);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
