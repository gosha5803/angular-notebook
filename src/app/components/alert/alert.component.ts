import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { IAlert } from '../../../models/customAlert';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  @Input() alertSettings: IAlert  = {} as IAlert

  constructor() {}

  ngOnInit(): void {
    this.alertSettings.isVisible = true
  }

  hideAlert() {
    console.log('sasa')
    this.alertSettings.isVisible = false
  }
}
