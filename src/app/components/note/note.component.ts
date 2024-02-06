import { Component, Input } from '@angular/core';
import { Note } from '../../../models/Inote';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router' 
import { FileUploadModule } from 'primeng/fileupload'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { StorageService } from '../../services/storage.service';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    ButtonModule, 
    RouterLink,
    FileUploadModule,
    InputTextareaModule,
    EditorComponent
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})

export class NoteComponent {
  @Input() note: Note | undefined
  @Input() onUpload: any //метод передаётся со страницы редактирования и создания записи.
  @Input() handleInput: any //метод передаётся со страницы редактирования и создания записи.
  @Input() page: 'main' | 'edit' = 'main' // Данный флаг позволяет по разному отрисовать карточку, если мы на странице редактирования/создания нам не нужны кнопки отредактировать и удалить а на глвной нужны.
  isDeleted: boolean = false

  constructor(
    private storageService: StorageService,
    ) {}

    //Метод форматирует дату создания записи из Date.now() в привычный вид.
    formateDate(date: number | undefined) {
      if(date) {
        const currentDate = new Date(+date)
        const result = currentDate.getDate() + '.' 
        + (currentDate.getMonth() + 1) + '.' 
        + currentDate.getFullYear() + ' ' 
        + currentDate.getHours() + ':' 
        + currentDate.getMinutes()
        return result
      }
      return 'No time'
    }

    //Метод удаляет текущую запись по id через сервис storage из localStorage по нажатию на кнопку удаления. Также переводит флаг isDeleted в true из-за чего стили меняются на display: none. Так как не смог поправить баг, что родительский компонент при переопределении массива записей не перерисовывал их реактивно.
    deleteNote() {
      if(this.note) {
        this.isDeleted = true
        this.storageService.removeNote(this.note.id)
      }
    }
   
}
