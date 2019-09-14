import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DisplayModeState } from './core/ngxs/states/displayMode.states';
import { Observable, from } from 'rxjs';
import { DisplayModeModel, DISPLAY_MODE_SHOW_FEATURED, DISPLAY_MODE_NORMAL } from './core/model/displayMode.model';
import { take, map } from 'rxjs/operators';
import { SwitchDisplayMode } from './core/ngxs/actions/displayMode.actions';
import { IFramePageState } from './core/ngxs/states/iframePage.state';
import { OpenIframe, CloseIframe, ToggleIframe } from './core/ngxs/actions/iframe.actions';
import { IframePageModel } from './core/model/iframePage.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'yangter';
  iframeUrl$: Observable<SafeUrl>;

  @Select(DisplayModeState) displayMode$: Observable<DisplayModeModel>;
  @Select(IFramePageState.isIframeOpen) isIframeOpen$: Observable<boolean>;
  @Select(IFramePageState) iframe$: Observable<IframePageModel>;
  @Select(IFramePageState.isIframeAvailable) isIframeAvailable$: Observable<boolean>;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.iframeUrl$ = this.iframe$.pipe(map(iframe => this.sanitizer.bypassSecurityTrustResourceUrl(iframe.url)));
    this.store.dispatch(new SwitchDisplayMode(DISPLAY_MODE_SHOW_FEATURED));
  }

  swicthDisplayMode() {
    this.displayMode$.pipe(take(1)).subscribe(value => {
      this.store.dispatch(new SwitchDisplayMode(value.name === 'normal' ? DISPLAY_MODE_SHOW_FEATURED : DISPLAY_MODE_NORMAL));
    });
  }

  openIframe() {
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new OpenIframe('https://m.bukalapak.com/p/fashion-pria/dompet-302/22499a7-jual-bogesi-dompet-kulit-pria-bogesi836-omhapgbk'));
  }

  toggleIframe() {
    this.store.dispatch(new ToggleIframe());
  }
}