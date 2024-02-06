import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Note } from '../../../models/Inote';
import { NoteComponent } from '../../components/note/note.component';
import { ButtonModule } from 'primeng/button';
import { StorageService } from '../../services/storage.service';
import { AlertComponent } from '../../components/alert/alert.component';
// import { IAlert } from '../../../models/customAlert';
// import { EditorComponent } from '../../components/editor/editor.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    RouterLink,
    NoteComponent,
    ButtonModule,
    // AlertComponent
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  note: Note | undefined
  user: null | string

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private router: Router
  ) {
    //Проверка авторизацц
    this.user = this.storage.getUser()
    if(!this.user) {
      this.router.navigate(['/', 'login'])
    }
    
    //Проверка существования поста. По кнопке редактировать мы переходим по пути create/:id с параметроа id, а по кнопке создать с главной страниц просто на путь create. И если айди нет, то создаётся базовое состояние записи, иначе существующая запись изется через сервис и берётся как состояние в данном мкомпоненте.
    const id = this.route.snapshot.paramMap.get('id')
    if(id) {
      this.note = storage.findById(+id)
    } else {
      this.note = {
        image: 'https://thumbs.dreamstime.com/z/no-photo-available-missing-image-no-image-symbol-isolated-white-background-no-photo-available-missing-image-no-image-272386847.jpg',
        text: 'Текст поста...',
        time: Date.now(),
        id: Date.now()
      }
    }
  }

  //Данный метод принимает в себя событие файлового инпута, достаёт от туда файл и считывает url изображения, после чего устанавливает его, как текущее для редактируемой записи. Сожно добваить проверку размреа файла и ввести ограничение.
  onUpload(event: any) {
    const file = event.target.files[0]

    // if(file.size > 500000) {

    // }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result
      if(url && this.note?.id) {
        this.note.image = url.toString()
      }
    }
    reader.readAsDataURL(file)
  }

  //Метод сохраняет состояние текущей записи в хранилище через метод сервиса.
  onSave() {
    console.log('sas')
    if(this.note){
      this.storage.addNote(this.note)
    }
  }

  //Метод присваивает значение textarea ключу text текущей записи.
  handleTextArea(ev: any) {
    // console.log(this.note)
    if(this.note)
    this.note.text = ev.target.value
  }
}
