import { Injectable } from '@angular/core';
import {InfoComponent} from './info/info.component'

@Injectable({
  providedIn: 'root'
})
export class InfoToRenderService {

  constructor(public InfoComponent: InfoComponent) {
    console.log(this.InfoComponent)
  }
}
