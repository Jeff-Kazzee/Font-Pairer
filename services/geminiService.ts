import { GoogleGenAI, Type } from "@google/genai";
import { PairingResult, CodeSnippets } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.OBJECT,
      description: 'The recommended font for headlines.',
      properties: {
        name: { type: Type.STRING, description: 'The Google Font family name (e.g., "Roboto Slab").' },
        weight: { type: Type.INTEGER, description: 'A suitable font weight, e.g., 700.' },
      },
      required: ['name', 'weight'],
    },
    body: {
      type: Type.OBJECT,
      description: 'The recommended font for body text.',
      properties: {
        name: { type: Type.STRING, description: 'The Google Font family name (e.g., "Open Sans").' },
        weight: { type: Type.INTEGER, description: 'A suitable font weight, e.g., 400.' },
      },
       required: ['name', 'weight'],
    },
    accent: {
      type: Type.OBJECT,
      description: 'The recommended font for accents or secondary headings.',
      properties: {
        name: { type: Type.STRING, description: 'The Google Font family name (e.g., "Playfair Display").' },
        weight: { type: Type.INTEGER, description: 'A suitable font weight, e.g., 600.' },
      },
       required: ['name', 'weight'],
    },
    reasoning: {
      type: Type.STRING,
      description: 'A 2-3 sentence explanation of why this font combination works well together, explaining the principles of contrast, harmony, and mood.'
    }
  },
  required: ['headline', 'body', 'accent', 'reasoning'],
};

export const getFontPairing = async (fontName: string): Promise<PairingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user has selected the font "${fontName}". Please provide a font pairing recommendation from the Google Fonts library.`,
      config: {
        systemInstruction: "You are an expert typographer and design assistant. Your goal is to provide professional font pairings for web design. For any given font, you must recommend a complementary headline font, body font, and accent font exclusively from the Google Fonts library. Ensure the font names are spelled correctly for use with the Google Fonts API.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString);
    return parsedResult as PairingResult;
  } catch (error) {
    console.error("Error fetching font pairing from Gemini API:", error);
    throw new Error("Failed to generate font pairing. The model may be unable to find a suitable match or there was a network issue.");
  }
};


const codeSnippetsSchema = {
    type: Type.OBJECT,
    properties: {
        html: {
            type: Type.STRING,
            description: `A string containing the complete HTML <link> tags to import all necessary Google Fonts. Preconnect links should be included. All font families and weights should be in a single request to Google Fonts.`
        },
        css: {
            type: Type.STRING,
            description: `A string containing the complete CSS code. It must include the @import rule for Google Fonts, define CSS custom properties (--font-headline, --font-body, --font-accent), and provide example usage for h1, body, and an .accent-text class.`
        },
        tailwind: {
            type: Type.STRING,
            description: `A string containing the full JavaScript code for a tailwind.config.js file. It must import 'defaultTheme' from 'tailwindcss/defaultTheme' and extend the 'fontFamily' with 'headline', 'body', and 'accent' keys, spreading the default theme's sans/serif fonts as fallbacks.`
        }
    },
    required: ['html', 'css', 'tailwind']
};

export const getCodeSnippets = async (inputFont: string, result: PairingResult): Promise<CodeSnippets> => {
  const prompt = `Given the font pairing for the base font "${inputFont}":
- Headline: ${result.headline.name} (weight: ${result.headline.weight})
- Body: ${result.body.name} (weight: ${result.body.weight})
- Accent: ${result.accent.name} (weight: ${result.accent.weight})

Generate code snippets for a web developer to use this pairing.
- The HTML snippet must include preconnect links and a single <link> to Google Fonts for all unique families and weights.
- The CSS snippet must include an @import, CSS custom properties for each font role, and example usage.
- The Tailwind snippet must show the full content for a tailwind.config.js file that extends the theme.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are an expert web development assistant specializing in typography. You provide clean, correct, and ready-to-use code snippets for HTML, CSS, and Tailwind CSS based on a given font pairing. The font names must be correct for the Google Fonts API.",
            responseMimeType: "application/json",
            responseSchema: codeSnippetsSchema,
        },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as CodeSnippets;
  } catch (error) {
    console.error("Error fetching code snippets from Gemini API:", error);
    throw new Error("Failed to generate code snippets.");
  }
};
