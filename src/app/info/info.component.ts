import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {InfoToRenderService} from '../info-to-render.service';



@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  providers: [InfoToRenderService]
})
export class InfoComponent implements OnInit {
  
  constructor() { 
 
  }

  ngOnInit(): void {
  }
  @Output() btnClick = new EventEmitter();

  onClick() {
    this.btnClick.emit()
  }
  

}
