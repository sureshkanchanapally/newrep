import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class WebService {
  serviceurl = environment.ServiceUrl;

  constructor(
    public Http: HttpClient,
  ) { }

  public async Common_API(body: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const Url = `${this.serviceurl}/call-stored-procedure`;
        return this.Http.post<any>(Url, body).pipe(
          // tap(d=> console.log(d))
          // map((d: any) => (d.Status_cd === "1" ? d.ds.Table[0] : d.ds.Table[0]))
        ).subscribe((r: any) => resolve(r), reject);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // public async Image_Uploade(body: any): Promise<any> {
  //       const url = `${this.serviceurl}/upload-image`;
  //       return this._httpClient.post<any>(url, body,{ observe: 'response' })
  //       .subscribe((r: any) => r);
  // }

  public Image_Uploade(formData: any) {
    // console.log(formData);
    const Url = `${this.serviceurl}/upload-image`;
    return this.Http.post(Url, formData
    );
  }

  public async uploadFile(body: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const url = `https://vantaapi.meanhost.in/v1/api/Upload/upload`;
        this.Http.post(url, body).pipe(
        ).subscribe((r: any) => resolve(r), reject
        );
      });
    } catch (error) {
      console.log(error);
    }
  }


}









