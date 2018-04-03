import {Component, Input, OnInit} from '@angular/core';
import {LiveEvent} from "../modules/event";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  @Input() events: LiveEvent[];

  constructor() {
  }

  ngOnInit() {
  }

}
