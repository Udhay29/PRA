import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

declare var JBH360Platform: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {

  @Input() isOpen: boolean;
  @Input() isLocked: boolean;
  @Input() isChanging: boolean;
  @Output() asideToggleLock: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() asideToggleOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  showAppDrawer = false;

  constructor() {
    try {
      JBH360Platform.init();
    } catch (error) {
    }
  }

  onToggleSidebarLeft(): void {
    if (!this.isChanging) {
      if (!this.isLocked) {
        this.asideToggleOpen.emit(!this.isOpen);
      }
    }
    if (!this.isOpen) {
      this.showAppDrawer = false;
    }
  }

  onLockSidebarLeft(): void {
    this.asideToggleLock.emit(!this.isLocked);
  }

  getSidebarLockIcon(): any {
    return this.isLocked ? 'icon-Pushpin_Pinned' : 'icon-Pushpin_UnPinned';
  }

  isSidebarLocked() {
    return this.isLocked ? 'router-container sidebar-locked' : 'router-container';
  }

  onToggleAppDrawer(): void {
    this.showAppDrawer = !this.showAppDrawer;
  }
}
