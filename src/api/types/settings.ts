/**
 * Kodi Settings API Types
 * Based on Kodi JSON-RPC Settings namespace
 */

/** Settings level filter */
export type SettingLevel = 'basic' | 'standard' | 'advanced' | 'expert';

/** Setting control types */
export type SettingControlType =
  | 'toggle'
  | 'slider'
  | 'spinner'
  | 'edit'
  | 'list'
  | 'button'
  | 'range';

/** Setting data types */
export type SettingType =
  | 'boolean'
  | 'integer'
  | 'number'
  | 'string'
  | 'action'
  | 'addon'
  | 'path'
  | 'list';

/** Setting control metadata */
export interface SettingControl {
  type: SettingControlType;
  format: string;
  delayed?: boolean;
  hidden?: boolean;
  popup?: boolean;
  multiselect?: boolean;
  formatlabel?: string;
  verifynewvalue?: boolean;
}

/** Setting option for dropdowns/lists */
export interface SettingOption {
  label: string;
  value: string | number;
}

/** Base setting interface */
export interface KodiSettingBase {
  id: string;
  label: string;
  help?: string;
  type: SettingType;
  level: SettingLevel;
  enabled: boolean;
  parent: string;
  control: SettingControl;
}

/** Boolean setting */
export interface KodiBooleanSetting extends KodiSettingBase {
  type: 'boolean';
  default: boolean;
  value: boolean;
}

/** Integer setting */
export interface KodiIntegerSetting extends KodiSettingBase {
  type: 'integer';
  default: number;
  value: number;
  minimum?: number;
  maximum?: number;
  step?: number;
  options?: SettingOption[];
}

/** Number setting (float) */
export interface KodiNumberSetting extends KodiSettingBase {
  type: 'number';
  default: number;
  value: number;
  minimum?: number;
  maximum?: number;
  step?: number;
  options?: SettingOption[];
}

/** String setting */
export interface KodiStringSetting extends KodiSettingBase {
  type: 'string';
  default: string;
  value: string;
  allowempty?: boolean;
  allownewoption?: boolean;
  options?: SettingOption[];
}

/** Path setting */
export interface KodiPathSetting extends KodiSettingBase {
  type: 'path';
  default: string;
  value: string;
  writable?: boolean;
  sources?: string[];
}

/** Action setting (button) */
export interface KodiActionSetting extends KodiSettingBase {
  type: 'action';
  default: string;
  value: string;
}

/** Addon setting */
export interface KodiAddonSetting extends KodiSettingBase {
  type: 'addon';
  default: string;
  value: string;
  addontype?: string;
  options?: SettingOption[];
}

/** List setting */
export interface KodiListSetting extends KodiSettingBase {
  type: 'list';
  default: string[];
  value: string[];
  options?: SettingOption[];
  definition?: {
    type: string;
    default: string;
    options?: SettingOption[];
  };
}

/** Union type for all settings */
export type KodiSetting =
  | KodiBooleanSetting
  | KodiIntegerSetting
  | KodiNumberSetting
  | KodiStringSetting
  | KodiPathSetting
  | KodiActionSetting
  | KodiAddonSetting
  | KodiListSetting;

/** Settings section (top-level) */
export interface KodiSettingSection {
  id: string;
  label: string;
}

/** Settings category (within a section) */
export interface KodiSettingCategory {
  id: string;
  label: string;
  help?: string;
}

/** API response for Settings.GetSections */
export interface GetSectionsResponse {
  sections: KodiSettingSection[];
}

/** API response for Settings.GetCategories */
export interface GetCategoriesResponse {
  categories: KodiSettingCategory[];
}

/** API response for Settings.GetSettings */
export interface GetSettingsResponse {
  settings: KodiSetting[];
}

/** API response for Settings.GetSettingValue */
export interface GetSettingValueResponse {
  value: boolean | number | string | string[];
}

/** Properties to request for sections */
export const SECTION_PROPERTIES = [] as const;

/** Properties to request for categories */
export const CATEGORY_PROPERTIES = ['help'] as const;
