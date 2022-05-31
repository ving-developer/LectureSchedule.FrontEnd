//angular imports
import { Component, OnInit, TemplateRef } from '@angular/core';
//installing packages imports
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
//internal imports
import { Lecture } from '../models/Lecture';
import { LectureService } from '../services/lecture.service';

@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.scss'],
  // providers: [LectureService] one way of receiving LectureService by dependency injection. The best approach is including in module.ts
})
export class LecturesComponent implements OnInit {
  public lectures: Lecture[] = [];
  public filteredLectures: Lecture[] = [];
  public imageWidth = 100;
  public imageMargin = 2;
  public hideImage = true;
  private listFilterString = '';
  public modalRef?: BsModalRef;

  public get listFilter(): string{
    return this.listFilterString;
  }

  public set listFilter(value: string){
    this.listFilterString = value;
    this.filteredLectures = this.listFilter ? this.filterLectures(this.listFilterString) : this.lectures;
  }

  filterLectures(filter: string): Lecture[]{
    filter = filter.toLowerCase();
    return this.lectures.filter(
      (lecture: Lecture) => lecture.theme.toLowerCase().indexOf(filter) !== -1 ||
            lecture.local.toLowerCase().indexOf(filter) !== -1
    );
  }

  constructor(
    private lectureService: LectureService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  public ngOnInit(): void {
    this.loadLectures()
  }

  public controlImageVisibility(): void{
    this.hideImage = !this.hideImage;
  }

  public loadLectures() : void {
    const observer = {
      next: (lectures: Lecture[]) => {
        this.lectures = lectures;
        this.filteredLectures = lectures;
      },
      error: (error: any) => console.log(error),
      complete: () => {}
    };
    this.lectureService.getLectures().subscribe(observer);
  }

  public openDeleteModal(template: TemplateRef<any>): void{
    this.modalRef = this.modalService.show(template);
  }

  public confirmDelete(): void{
    this.toastr.warning('Lecture has been deleted.', 'Sucess!');
    this.modalRef?.hide();
  }

  public cancelDelete(): void{
    this.modalRef?.hide();
  }
}
