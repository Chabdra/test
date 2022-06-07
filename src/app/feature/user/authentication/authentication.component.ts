import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {WowzaInitService} from '../services/WowzaInitService/wowza-init.service';
import {ScriptLoadService} from '../services/script-load.service';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {WindowRefService} from '../services/window-ref.service';
import {ApiCallService} from '../services/ApiCall/api-call.service';
import {HttpInterceptorService} from '../services/HttpInterceptor/http-interceptor.service';
import {DeviceDetectorServiceService} from '../services/DeviceDetectorService';
import {ThirdPartyUrlHandlingService} from '../services/ThirdPartyUrlHandling/third-party-url-handling.service';

declare function startRecording(): any;

declare function stopRecording(): any;

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, AfterViewInit {
  @ViewChild('flashContent') flashContent1: ElementRef;
  currentUrl: any;
  error: any;
  userData: any;
  show = false;
  flashLoad = false;
  screenwidth: number;
  res: Object;
  reward: boolean;

  constructor(
    private _sl: ScriptLoadService,
    private _ws: WowzaInitService,
    @Inject(DOCUMENT) document,
    private router: Router,
    private winRef: WindowRefService,
    private _route: ActivatedRoute,
    public _api: ApiCallService,
    private _IC: HttpInterceptorService,
    private _DI: DeviceDetectorServiceService,
    private _TP: ThirdPartyUrlHandlingService
  ) {
  }

  ngOnInit() {
    
    // window.location.href= "https://dev.monetrewards.com/monetrewards/heropage/?code=20&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id

    this.screenwidth = window.screen.width;

    localStorage.clear();
    // if(JSON.parse(localStorage.getItem('params')).monet_rewards == 'true'){
    //   this.reward = true;
    // }
    // else{
    //   this.reward = false;
    // }
    /*this._api.getApiWithParms('getQueCards', { l_id : 1}).subscribe( success => {
      console.log(success, 'success');
    });*/
  }

  reload() {
    window.location.reload();
  }
//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
  createOb() {
    const d1 = this.flashContent1.nativeElement;
    this._ws.createTargetDiv(d1)
      .then((ap) => {
        this.flashLoad = true;
        const flashMessage = document.getElementById('flash-message');
        flashMessage.click();
        this.show = true;
        /*this._ws.createObject().then(() => {
          this._ws.getCameraStatus().then((abc) => {
            // console.log(abc);
          }).catch((err) => {
            console.log(err);
          });
        });*/
      }).catch(() => {
      // flash allow successfully
      const data = {monet_id: this.userData.mo_id, page_stage: 2, timeStamp: Date.now()};
      this._api.updatePageStage(data).subscribe(() => {
      });
      /*this._api.updateTrack({monet_id: JSON.parse(localStorage.getItem('authData')).mo_id, timeStamp: Date.now(), event: 'flash allow successfully, redirect on termsConditions'}).subscribe( () => {});*/
      this.router.navigate(['/user/main/termsConditions']);
    });

    /*Load File as dependency*/
    this._sl.load('swfobject').then(data => {
      this._sl.load('wowza', 'jquery', 'facedetection').then(data1 => {
        this._sl.load('youtube').then(data2 => {
        });
      });
    });
    const ob = setInterval(() => {
      if (document.getElementsByClassName('swfobject') && document.getElementsByClassName('swfobject').length > 0 && document.getElementsByClassName('wowza') && document.getElementsByClassName('wowza').length > 0 && document.getElementsByClassName('jquery') && document.getElementsByClassName('jquery').length > 0) {
        /*const flashMessage = document.getElementById('flash-message');
        this.show = true;
        flashMessage.click();*/
        clearInterval(ob);
      }
    }, 100);
  }

  startRec() {
    startRecording();
  }

  stopRec() {
    stopRecording();
  }

  webRtc() {
    this.show = true;
    const data = {monet_id: this.userData.mo_id, page_stage: 2, timeStamp: Date.now()};
    this._api.updatePageStage(data).subscribe(() => {
    });
    /*this._api.updateTrack({monet_id: JSON.parse(localStorage.getItem('authData')).mo_id, timeStamp: Date.now(), event: 'flash allow successfully, redirect on termsConditions'}).subscribe( () => {});*/
    this.router.navigate(['/user/main/termsConditions']);
    /*this._sl.load('monet', 'index').then(data1 => {
    });*/
  }

  close(){
    const rid_obj = {code: this.res['code'], ex_id: JSON.parse(localStorage.getItem('params')).tr_id};
    if(JSON.parse(localStorage.getItem('params')).monet_rewards=='true'){
      window.location.href = "https://diy2.monetrewards.com/heropage/?code=20&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id
    //  window.location.href = "https://dev.monetrewards.com/monetrewards/heropage/?code=20&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id
    }
  else  if (localStorage.getItem('fulcrum') == 'false' && this.res['code'] != 200) {
        window.location.href = 'https://www.eemo.live/';
    } else {
        // this._TP.Rejection(rid_obj);
        window.location.href = 'https://samplicio.us/s/ClientCallBack.aspx?RIS=20&RID=' + JSON.parse(localStorage.getItem('params')).tr_id
    }
    
}


  success() {
    this._route.queryParams.subscribe(params => {
      localStorage.setItem('fulcrum', params.fulcrum);
      if (params && params['uni_user']) {
        let Uni_User;
        if (params['uni_user']) {
          Uni_User = (params['uni_user'] === 'true') ? '1' : '0';
          localStorage.setItem('uni_user', Uni_User);
        } else if (!params['uni_user']) {
          localStorage.setItem('uni_user', '0');
          Uni_User = localStorage.getItem('uni_user');
        }
      }
      if (params['l_id']) {
        localStorage.setItem('l_id', params['l_id']);
      }
      const param = JSON.parse(JSON.stringify(params));
      param['platform'] = window.navigator.platform;
      param['device_info'] = {browser_info: this._DI.getDeviceInfo(), width: window.innerWidth, height: window.innerHeight};
      localStorage.setItem('params', JSON.stringify(params));
      console.log('params', params);
      this._api.ExternalUser(param).subscribe((res) => {
        this.res = res
        localStorage.setItem('code', res['code']);
        console.log(res['code']);
        const rid_obj = {code: res['code'], ex_id: JSON.parse(localStorage.getItem('params')).tr_id};
       
      // if(JSON.parse(localStorage.getItem('params')).monet_rewards == 'true' && res['code']!=200)
      // window.location.href= "https://dev.monetrewards.com/monetrewards/heropage/?code=20&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id;
      

        if (res['response'] && res['response'].token) {
          if (!params['l_id']) {
            localStorage.setItem('l_id', res['response']['cnt_l_id']);
          }
          localStorage.setItem('token', res['response'].token);
          this._api.auth.next(res['response']);
          this.userData = res['response'];
          res['response'].content_details && res['response'].content_details.length ? localStorage.setItem('isCluster', '1') : localStorage.setItem('isCluster', '0');
          // user created
          const data = {monet_id: res['response'].mo_id ? res['response'].mo_id : res['response'].mo_ids.map(a => a.mo_id), page_stage: 1, timeStamp: Date.now()};
          this._api.updatePageStage(data).subscribe(() => {
            // this.createOb();
            this.webRtc();
          });

          this._api.getApi('/getQueCards?l_id=' + (localStorage.getItem('l_id') ? localStorage.getItem('l_id') : res['response'].cnt_l_id ? res['response'].cnt_l_id : res['response'].cmp_l_id)).subscribe(success => {
            // this._api.getApi('/getQueCards?l_id=63').subscribe( success => {
            if (success['response'] && success['response']['l_survey_config']) {
              this._api.cardData = success['response'];
              this._api.queCard(success['response']);
              this._api.survey_configData(success['response']['l_survey_config']);
              this._api.navTabObsrvable(success['response']['l_top_nav']);
            }
          });
          let cluster = false;
          if (res['response'].content_details) {
            res['response'].content_details.map(a => {
              a['mo_id'] = res['response'].mo_ids.filter(b => b.cnt_id === a.cnt_id)[0].mo_id;
              return a;
            });
            // res['response'].content_details ? 'cmp_id' : 'cnt_id'
            if (res['response'].content_details) {
              res['response'].facial_expression = res['response'].content_details[0].facial_expression;
              cluster = true;
            }
          }
          const prePostParams = {monet_id: res['response'].mo_id ? res['response'].mo_id : res['response'].mo_ids.map(a => a.mo_id)};
          prePostParams[cluster ? 'cmp_id' : 'cnt_id'] = cluster ? res['response'].cmp_id : res['response'].cnt_id;
          console.log('Pre Post surevey Params', prePostParams);
          this._api.Pre_Survey(prePostParams).subscribe((response) => this._api.preSurveyData(response));
          this._api.Post_Survey(prePostParams).subscribe((response) => this._api.postSurveyData(response));
          localStorage.setItem('authData', JSON.stringify(res['response']));
          this._api.ExternalFunction(res['response']);
          this._api.termsData(res);
        } else {
          this.error = res['message'];
          console.log(this.error);
          
          // if(this.error == 'Campaign is Over'){
        if(this.error){
          setTimeout(()=>{
             if(JSON.parse(localStorage.getItem('params')).monet_rewards=='true'){
    window.location.href = "https://diy2.monetrewards.com/heropage/?code=40&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id
     // window.location.href = "https://dev.monetrewards.com/monetrewards/heropage/?code=40&tr_id=" + JSON.parse(localStorage.getItem('params')).tr_id
    }
  else  if (localStorage.getItem('fulcrum') == 'false' && this.res['code'] != 200) {
        window.location.href = 'https://www.eemo.live/';
    } else {
        // this._TP.Rejection(rid_obj);
        window.location.href = 'https://samplicio.us/s/ClientCallBack.aspx?RIS=20&RID=' + JSON.parse(localStorage.getItem('params')).tr_id
    } },3000)
         

          }
        }
      });
    });
  }
 

  checkDevice(device) {
    if (navigator.platform.search(device) === -1) {
      alert('This campaign is not available on ' + navigator.platform + ' device. Open this link on desktop');
      window.addEventListener('load', window.close);
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      console.log('device success');
      this.success();
    }
  }

  ngAfterViewInit() {
    console.log(this._route.queryParams);
    this._route.queryParams.subscribe(next => {
      console.log(next);
      switch (next.device) {
        case 'a': {
          this.checkDevice('Linux');
          break;
        }
        case 'w': {
          if (navigator.platform.search('Mac') !== -1) {
            this.checkDevice('Mac');
          } else if (navigator.platform.search('Win') !== -1) {
            this.checkDevice('Win');
          }
          break;
        }
        case 'a,w': {
          if (navigator.platform.search('Win') !== -1) {
            this.checkDevice('Win');
          } else if (navigator.platform.search('Mac') !== -1) {
            this.checkDevice('Mac');
          } else if (navigator.platform.search('Linux') !== -1) {
            this.checkDevice('Linux');
          } else {
            this.checkDevice('Linux');
          }
          break;
        }
        default: {
          this.success();
        }
      }
    });
  }
}
