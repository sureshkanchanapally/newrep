import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonService } from '../../Services/common.service';
import { SocketService } from '../../Services/socke.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  ProfileForm: FormGroup
  Submitted = false;
  validbutton = false;
  private socket: any;
  public data: any;


  newMessage: any;
  messageList: any = [];

  @ViewChild('audio', { static: true }) audio: ElementRef<HTMLAudioElement>;

  constructor(
    private fb: FormBuilder,
    private chatService: SocketService,
    private CF: CommonService
  ) {
    // this.socket = io('http://localhost:4200');
  }

  ngOnInit() {
    this.Get_Socket();
  }

  // public Socket(): void {
  //   this.socket.on('notification', data => {
  //     console.log('Sokect Responce',data);
  //     this.data = data;
  //   });
  // }


  Get_Socket() {
    this.chatService.getNewMessage().subscribe((message: any) => {
      console.log(message);
      if (message) {
        this.messageList.push(message);
        console.log(this.messageList)
       if (this.messageList.length != 0) {
        this.Swalhtml(message, 'Success'),
        this.notify();
        this.CF.updateDashboard.next(true);
       } else {
        this.CF.updateDashboard.next(true);
       }
      } else {
        this.CF.updateDashboard.next(true);
      }
    })
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  notify() {
    this.audio.nativeElement.pause();
    this.audio.nativeElement.currentTime = 0;
    this.audio.nativeElement.play();
    this.audio.nativeElement.loop = true;
  }

  public Swalhtml(Heading: any, msg: any) {
    console.log(Heading);
    console.log(msg);
    Swal.fire({
      // title: Heading,
      html: msg,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
    }).then((result) => {
      console.log(result);
      this.audio.nativeElement.loop = false;
      if (result.isConfirmed == true) {
        // this.CF.GotoURL('/myorder');
      }
      // this.CF.GotoURL('/myorder');
    });
  }

}
