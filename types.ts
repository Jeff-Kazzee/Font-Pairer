export interface FontRecommendation {
  name: string;
  weight: number;
}

export interface PairingResult {
  headline: FontRecommendation;
  body: FontRecommendation;
  accent: FontRecommendation;
  reasoning: string;
}

export interface CodeSnippets {
  html: string;
  css: string;
  tailwind: string;
}
