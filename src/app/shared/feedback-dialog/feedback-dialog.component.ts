import { Component,Input  } from '@angular/core';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [],
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.scss'
})

export class FeedbackDialogComponent {
  @Input() messageInput: string | undefined;
  message = '';
  @Input() dialogOpen: boolean;

  constructor() { 
    this.dialogOpen = false;
  }
  ngOnInit() {
    this.dialogOpen = true;
    if (this.messageInput != undefined) {
      this.message = this.messageInput || 'feedback-dialog works!';
    }
  }
}
