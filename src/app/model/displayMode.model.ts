export interface DisplayModeModel {
  name: 'normal' | 'showFeatured';
  showTopGap: boolean;
  showFeatured: boolean;
  showMainContent: boolean;
  transparentHeader: boolean;
}

export const DISPLAY_MODE_SHOW_FEATURED: DisplayModeModel = {
  name: 'showFeatured',
  showTopGap: true,
  showFeatured: true,
  showMainContent: false,
  transparentHeader: true,
};

export const DISPLAY_MODE_NORMAL: DisplayModeModel = {
  name: 'normal',
  showFeatured: false,
  showTopGap: false,
  showMainContent: true,
  transparentHeader: false,
};
