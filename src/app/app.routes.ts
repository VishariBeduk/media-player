import {Routes} from '@angular/router';
import {Mp3PlayerComponent} from './mp3-player/mp3-player';
import {Mp4PlayerComponent} from './mp4-player/mp4-player';
import {ImgPlayerComponent} from './img-player/img-player';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'img', component: ImgPlayerComponent},
  {path: 'mp3', component: Mp3PlayerComponent},
  {path: 'mp4', component: Mp4PlayerComponent}
];

