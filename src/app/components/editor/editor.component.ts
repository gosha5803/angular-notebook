import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
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
//Компонент библиотеки EDitorJS
export class EditorComponent implements AfterViewInit {
  @Input() initialText: string | undefined = ''
  @Output() contentEmmiter = new EventEmitter()
  alert: IAlert = {} as IAlert
  private editor: EditorJS | undefined

  @ViewChild('editor', {read: ElementRef, static: true})
  editorElement: ElementRef | undefined
  
  constructor() {
  }

  ngAfterViewInit(): void {
    this.initializeEditor()
  }

  //Инициализация editor согласно документации, изначальное значение это текущий текст записи, которая редактируется.
  private initializeEditor() {
    this.editor = new EditorJS({
      minHeight: 10,
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

  //Внутри метода извлекается состояние эдитора и передаётся как иммитируемый ивент наверх. Далее инициализируется подсказка, что текст спешно отформатирован.
  showEditorData() {
    this.editor?.save()
    .then(d => this.contentEmmiter.emit(d.blocks[0].data.text))

      // this.handleInput(d.blocks[0].data.text))
    .then(() => {
      this.initAlert({
        message: 'Формат текста успешно сохранён',
        color: 'green'
      })
    })
  }

  //Инициализатор подсказки, как в loginComponent.
  initAlert({message, color}: IAlert) {
    this.alert.message = message
    this.alert.color = color
    setTimeout(() => {
      this.alert.message = ''
    }, 3000) 
  }
}
