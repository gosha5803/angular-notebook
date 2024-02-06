import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { Note } from '../../../models/Inote';
import { NoteComponent } from '../../components/note/note.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginPageComponent } from '../login-page/login-page.component';
import { StorageService } from '../../services/storage.service';
 
//Компонент главной страницы дневника, на него выводится список записей.
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    ButtonModule,
    NoteComponent,
    RouterLink, 
    LoginPageComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})

export class MainPageComponent {
  notes: Note[] //Состояние записей, которые и отрисовывает страница. Компонент проходится по массиву циклом и каждый элемент внедряет в компонент note-component.
  user: string | undefined | null //Ключ user, проверяется при инициализации компонента.
  
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
    ) {
      // this.notesService.deleteNote = this.notesService.deleteNote.bind(this) 
      //Так как кнопка функция удаления передается внутрь компонента каждой записи, байндим контекст из родительского компонента.
      this.notes = this.storageService.getNotes() //Записи в текущее состояние получает им сервиса хранилища, методл забирает их из localStorage.

      //Проверка авторизации.
      this.user = this.storageService.getUser()
      if(!this.user) {
        this.router.navigate(['/', 'login'])
      } 
      this.sortNotes()
    }

  //Метод который отрабатывает по кнопке выйти на главной странице. Он вызывает метод сервиса logout() и редиректит пользователя на страницу регистрации.
  logout() {
    this.authService.logout()
    this.router.navigate(['/', 'login'])
  }

  //Функция сортировки записей по дате и времени создания
  sortNotes() {
    this.notes.sort((a, b) => {
      if (a.time < b.time) {
        return 1
      } else {
        return -1  
      }
    })
  }
}
