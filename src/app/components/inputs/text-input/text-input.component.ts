import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TextInputComponent implements OnInit {
  @Input() placeholder: string;
  @Input() icon: string;
  _value = '';
  @Input() set value(val) { this._value = val; }
  get value(): string { return this.inputRef.nativeElement.value; }

  @Output() keyUp = new EventEmitter<string>();
  @Output() iconClick = new EventEmitter<string>();
  @Output() keyEnterPressed = new EventEmitter<string>();

  @ViewChild('input', { static: true}) inputRef: ElementRef;

  currentValue$ = new BehaviorSubject(this._value);

  constructor() { }

  ngOnInit() { }

  onKeyUp() {
    this.keyUp.emit(this.value);
    this.currentValue$.next(this.value);
  }

  onKeyEnter() {
    this.keyEnterPressed.emit(this.value);
  }

  onIconClick() {
    this.iconClick.emit(this.value);
  }

}
