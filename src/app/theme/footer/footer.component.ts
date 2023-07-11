import { Component, OnInit ,Input} from '@angular/core';
import { Version } from 'src/app/interfaces/version.interface';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() version: Version; 

  constructor() {}

  ngOnInit(): void { }

}
