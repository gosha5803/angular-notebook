import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { ButtonModule } from 'primeng/button';
import { AlertComponent } from '../alert/alert.component';
import { IAlert } from '../../../models/customAlert';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    ButtonModule,
    AlertComponent
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewInit {
  @Input() initialText: string | undefined = ''
  @Input() handleInput: any

  alert: IAlert = {} as IAlert
  private editor: EditorJS | undefined
  @ViewChild('editor', {read: ElementRef, static: true})
  editorElement: ElementRef | undefined
  
  constructor() {
  }

  ngAfterViewInit(): void {
    this.initializeEditor()
  }

  private initializeEditor() {
    this.editor = new EditorJS({
      minHeight: 145,
      holder: this.editorElement?.nativeElement,
      data: {
        blocks:[
          {
            type: 'paragraph',
            data: {
              text: this.initialText
            }
          }
        ]
      } 
    })
  }

  showEditorData() {
    this.editor?.save()
    .then(d => this.handleInput(d.blocks[0].data.text))
    .then(() => {
      this.initAlert({
        message: 'Формат текста успешно сохранён',
        color: 'green'
      })
    })
  }

  initAlert({message, color}: IAlert) {
    this.alert.message = message
    this.alert.color = color
    setTimeout(() => {
      this.alert.message = ''
    }, 3000) 
  }
}
