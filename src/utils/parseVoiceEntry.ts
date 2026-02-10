import type { Food, Texture } from '../lib/types';
import { getLocalDateString } from '../lib/dateUtils';

export interface ParsedVoiceEntry {
  foodId: string | null;
  foodName: string;
  matchedFood: Food | null;
  date: string;
  texture: Texture;
  notes: string;
  confidence: 'high' | 'medium' | 'low';
  rawTranscript: string;
}

// Parse date from spoken text
function parseDate(text: string): { date: string; remaining: string } {
  const today = new Date();
  const lowerText = text.toLowerCase();

  // Check for "today"
  if (lowerText.includes('today')) {
    return {
      date: getLocalDateString(today),
      remaining: text.replace(/today/gi, '').trim(),
    };
  }

  // Check for "yesterday"
  if (lowerText.includes('yesterday')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      date: getLocalDateString(yesterday),
      remaining: text.replace(/yesterday/gi, '').trim(),
    };
  }

  // Check for "tomorrow"
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      date: getLocalDateString(tomorrow),
      remaining: text.replace(/tomorrow/gi, '').trim(),
    };
  }

  // Check for specific dates like "February 5th", "5th of February", "Feb 5", "5 February"
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const monthsShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // Pattern: "February 5th" or "February 5" or "Feb 5th"
  const monthFirstRegex = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?\b/gi;
  const monthFirstMatch = lowerText.match(monthFirstRegex);
  if (monthFirstMatch) {
    const match = monthFirstMatch[0].toLowerCase();
    const parts = match.match(/([a-z]+)\s+(\d+)/);
    if (parts) {
      const monthStr = parts[1];
      const day = parseInt(parts[2]);
      let monthIndex = months.indexOf(monthStr);
      if (monthIndex === -1) monthIndex = monthsShort.indexOf(monthStr);
      if (monthIndex !== -1 && day >= 1 && day <= 31) {
        const targetDate = new Date(today.getFullYear(), monthIndex, day);
        return {
          date: getLocalDateString(targetDate),
          remaining: text.replace(monthFirstRegex, '').trim(),
        };
      }
    }
  }

  // Pattern: "5th of February" or "5 February" or "5th February"
  const dayFirstRegex = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/gi;
  const dayFirstMatch = lowerText.match(dayFirstRegex);
  if (dayFirstMatch) {
    const match = dayFirstMatch[0].toLowerCase();
    const parts = match.match(/(\d+)\s*(?:st|nd|rd|th)?\s*(?:of\s+)?([a-z]+)/);
    if (parts) {
      const day = parseInt(parts[1]);
      const monthStr = parts[2];
      let monthIndex = months.indexOf(monthStr);
      if (monthIndex === -1) monthIndex = monthsShort.indexOf(monthStr);
      if (monthIndex !== -1 && day >= 1 && day <= 31) {
        const targetDate = new Date(today.getFullYear(), monthIndex, day);
        return {
          date: getLocalDateString(targetDate),
          remaining: text.replace(dayFirstRegex, '').trim(),
        };
      }
    }
  }

  // Check for day names (e.g., "Monday", "last Tuesday")
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < days.length; i++) {
    const dayRegex = new RegExp(`(last\\s+)?${days[i]}`, 'gi');
    const match = lowerText.match(dayRegex);
    if (match) {
      const targetDay = i;
      const currentDay = today.getDay();
      let daysAgo = currentDay - targetDay;
      if (daysAgo <= 0) daysAgo += 7;
      if (match[0].toLowerCase().includes('last')) {
        daysAgo += 7;
      }
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - daysAgo);
      return {
        date: getLocalDateString(targetDate),
        remaining: text.replace(dayRegex, '').trim(),
      };
    }
  }

  // Default to today
  return {
    date: getLocalDateString(today),
    remaining: text,
  };
}

// Parse texture from spoken text
function parseTexture(text: string): { texture: Texture; remaining: string } {
  const lowerText = text.toLowerCase();

  // Map common spoken variations to textures
  const textureMap: { [key: string]: Texture } = {
    'puree': 'puree',
    'pureed': 'puree',
    'blended': 'puree',
    'smooth': 'puree',
    'paste': 'paste',
    'mashed': 'mashed',
    'mash': 'mashed',
    'soft chunks': 'soft chunks',
    'chunks': 'soft chunks',
    'chunky': 'soft chunks',
    'finger food': 'finger food',
    'finger foods': 'finger food',
    'fingers': 'finger food',
    'blw': 'finger food', // Baby-led weaning
    'mixed': 'mixed',
    'combination': 'mixed',
  };

  for (const [spoken, texture] of Object.entries(textureMap)) {
    if (lowerText.includes(spoken)) {
      const regex = new RegExp(spoken, 'gi');
      return {
        texture,
        remaining: text.replace(regex, '').trim(),
      };
    }
  }

  // Default to puree (most common for starting solids)
  return {
    texture: 'puree',
    remaining: text,
  };
}

// Find best matching food from user's food list
function findFood(text: string, foods: Food[]): { food: Food | null; confidence: 'high' | 'medium' | 'low'; foodName: string } {
  const lowerText = text.toLowerCase();

  // Clean up common filler words
  const cleanedText = lowerText
    .replace(/\b(gave|give|had|have|fed|feed|ate|eat|tried|try|some|the|a|an|her|him|baby|with)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanedText) {
    return { food: null, confidence: 'low', foodName: '' };
  }

  // Try exact match first
  const exactMatch = foods.find(f => f.name.toLowerCase() === cleanedText);
  if (exactMatch) {
    return { food: exactMatch, confidence: 'high', foodName: exactMatch.name };
  }

  // Try partial match (food name contains the text or text contains food name)
  const partialMatches = foods.filter(f => {
    const foodName = f.name.toLowerCase();
    return foodName.includes(cleanedText) || cleanedText.includes(foodName);
  });

  if (partialMatches.length === 1) {
    return { food: partialMatches[0], confidence: 'high', foodName: partialMatches[0].name };
  }

  if (partialMatches.length > 1) {
    // Return the shortest match (most specific)
    const bestMatch = partialMatches.sort((a, b) => a.name.length - b.name.length)[0];
    return { food: bestMatch, confidence: 'medium', foodName: bestMatch.name };
  }

  // Try fuzzy matching - check if any word in the text matches a food
  const words = cleanedText.split(' ');
  for (const word of words) {
    if (word.length < 3) continue; // Skip short words

    const wordMatch = foods.find(f => {
      const foodName = f.name.toLowerCase();
      return foodName.includes(word) || word.includes(foodName);
    });

    if (wordMatch) {
      return { food: wordMatch, confidence: 'medium', foodName: wordMatch.name };
    }
  }

  // No match found - extract what seems like a food name
  // Take the first significant word(s) as the food name
  const potentialFoodName = cleanedText.split(' ').slice(0, 2).join(' ');
  return { food: null, confidence: 'low', foodName: potentialFoodName || cleanedText };
}

export function parseVoiceEntry(transcript: string, foods: Food[]): ParsedVoiceEntry {
  let remaining = transcript;

  // Parse date first
  const dateResult = parseDate(remaining);
  remaining = dateResult.remaining;

  // Parse texture
  const textureResult = parseTexture(remaining);
  remaining = textureResult.remaining;

  // Find food
  const foodResult = findFood(remaining, foods);

  return {
    foodId: foodResult.food?.id || null,
    foodName: foodResult.foodName,
    matchedFood: foodResult.food,
    date: dateResult.date,
    texture: textureResult.texture,
    notes: '',
    confidence: foodResult.confidence,
    rawTranscript: transcript,
  };
}
