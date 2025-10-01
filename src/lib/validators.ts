import type { Entry, Settings } from '@/types';

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data: T;
  errors: string[];
  warnings: string[];
  repaired: boolean;
}

/**
 * Validate section structure (good/improve/etc)
 */
function validateSection(section: any, sectionName: string): { data: any; warnings: string[]; repaired: boolean } {
  const warnings: string[] = [];
  let repaired = false;

  if (!section || typeof section !== 'object') {
    return { data: null, warnings, repaired };
  }

  const validated: any = {};

  // Validate itemIds array
  if (Array.isArray(section.itemIds)) {
    validated.itemIds = section.itemIds.filter((id: any) => typeof id === 'string');
    if (validated.itemIds.length !== section.itemIds.length) {
      warnings.push(`${sectionName}: Invalid itemIds removed`);
      repaired = true;
    }
  }

  // Validate tagIds array (legacy)
  if (Array.isArray(section.tagIds)) {
    validated.tagIds = section.tagIds.filter((id: any) => typeof id === 'string');
  }

  // Validate qty object
  if (section.qty && typeof section.qty === 'object') {
    const validatedQty: Record<string, number> = {};
    for (const [key, value] of Object.entries(section.qty)) {
      if (typeof key === 'string' && typeof value === 'number' && value >= 0) {
        validatedQty[key] = value;
      } else {
        warnings.push(`${sectionName}: Invalid qty entry removed`);
        repaired = true;
      }
    }
    validated.qty = validatedQty;
  }

  // Validate note
  if (typeof section.note === 'string') {
    validated.note = section.note.slice(0, 2000);
  }

  // Validate boolean flags
  if (typeof section.tawbah === 'boolean') {
    validated.tawbah = section.tawbah;
  }

  // Validate guidance/intention strings
  if (typeof section.guidance === 'string') {
    validated.guidance = section.guidance.slice(0, 1000);
  }
  if (typeof section.intention === 'string') {
    validated.intention = section.intention.slice(0, 1000);
  }

  return { data: Object.keys(validated).length > 0 ? validated : null, warnings, repaired };
}

/**
 * Validate and repair Entry data
 */
export function validateEntry(data: any): ValidationResult<Entry> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let repaired = false;

  // Create safe defaults
  const safeEntry: Entry = {
    id: '',
    dateISO: '',
    good: null,
    improve: null,
    privacy_level: 'normal',
  };

  // Validate and repair id
  if (typeof data?.id === 'string' && data.id.length > 0) {
    safeEntry.id = data.id;
  } else {
    safeEntry.id = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    warnings.push('Missing or invalid id - generated new id');
    repaired = true;
  }

  // Validate and repair dateISO
  if (typeof data?.dateISO === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.dateISO)) {
    safeEntry.dateISO = data.dateISO;
  } else {
    safeEntry.dateISO = new Date().toISOString().split('T')[0];
    warnings.push('Missing or invalid dateISO - using current date');
    repaired = true;
  }

  // Validate good section
  if (data?.good) {
    const result = validateSection(data.good, 'good');
    safeEntry.good = result.data;
    warnings.push(...result.warnings);
    if (result.repaired) repaired = true;
  }

  // Validate improve section
  if (data?.improve) {
    const result = validateSection(data.improve, 'improve');
    safeEntry.improve = result.data;
    warnings.push(...result.warnings);
    if (result.repaired) repaired = true;
  }

  // Validate severeSlip section
  if (data?.severeSlip) {
    const result = validateSection(data.severeSlip, 'severeSlip');
    safeEntry.severeSlip = result.data;
    warnings.push(...result.warnings);
    if (result.repaired) repaired = true;
  }

  // Validate missedOpportunity section
  if (data?.missedOpportunity) {
    const result = validateSection(data.missedOpportunity, 'missedOpportunity');
    safeEntry.missedOpportunity = result.data;
    warnings.push(...result.warnings);
    if (result.repaired) repaired = true;
  }

  // Validate dua
  if (typeof data?.dua === 'string') {
    safeEntry.dua = data.dua.slice(0, 5000);
  }

  // Validate privacy_level
  const validPrivacy = ['normal', 'private', 'highly_sensitive'];
  if (typeof data?.privacy_level === 'string' && validPrivacy.includes(data.privacy_level)) {
    safeEntry.privacy_level = data.privacy_level as 'normal' | 'private' | 'highly_sensitive';
  } else if (data?.privacy_level !== undefined) {
    warnings.push('Invalid privacy_level - using default normal');
    repaired = true;
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    data: safeEntry,
    errors,
    warnings,
    repaired,
  };
}

/**
 * Validate and repair Settings data
 */
export function validateSettings(data: any): ValidationResult<Settings> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let repaired = false;

  const safeSettings: Settings = {
    reminderHour: 21,
    reminderMinute: 0,
    biometricLock: false,
    privateMode: false,
  };

  // Validate reminderHour
  if (typeof data?.reminderHour === 'number' && data.reminderHour >= 0 && data.reminderHour <= 23) {
    safeSettings.reminderHour = data.reminderHour;
  } else if (data?.reminderHour !== undefined) {
    warnings.push('Invalid reminderHour - using default 21');
    repaired = true;
  }

  // Validate reminderMinute
  if (typeof data?.reminderMinute === 'number' && data.reminderMinute >= 0 && data.reminderMinute <= 59) {
    safeSettings.reminderMinute = data.reminderMinute;
  } else if (data?.reminderMinute !== undefined) {
    warnings.push('Invalid reminderMinute - using default 0');
    repaired = true;
  }

  // Validate biometricLock
  if (typeof data?.biometricLock === 'boolean') {
    safeSettings.biometricLock = data.biometricLock;
  } else if (data?.biometricLock !== undefined) {
    warnings.push('Invalid biometricLock - using default false');
    repaired = true;
  }

  // Validate privateMode
  if (typeof data?.privateMode === 'boolean') {
    safeSettings.privateMode = data.privateMode;
  } else if (data?.privateMode !== undefined) {
    warnings.push('Invalid privateMode - using default false');
    repaired = true;
  }

  return {
    isValid: errors.length === 0,
    data: safeSettings,
    errors,
    warnings,
    repaired,
  };
}

/**
 * Validate array of entries and filter out invalid ones
 */
export function validateEntries(entries: any[]): {
  valid: Entry[];
  invalid: number;
  repaired: number;
  warnings: string[];
} {
  const valid: Entry[] = [];
  let invalid = 0;
  let repaired = 0;
  const warnings: string[] = [];

  if (!Array.isArray(entries)) {
    return { valid: [], invalid: 0, repaired: 0, warnings: ['Entries is not an array'] };
  }

  for (const entry of entries) {
    const result = validateEntry(entry);
    
    if (result.isValid) {
      valid.push(result.data);
      if (result.repaired) {
        repaired++;
      }
      warnings.push(...result.warnings);
    } else {
      invalid++;
      warnings.push(...result.errors);
    }
  }

  return { valid, invalid, repaired, warnings };
}
