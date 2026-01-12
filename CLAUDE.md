# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LoanLens is an AI-powered loan underwriting application built with React, TypeScript, and Vite. It uses Google's Gemini 3 API to analyze financial documents and provide loan recommendations based on configurable risk parameters.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Set the following in `.env` or `.env.local` file at the project root:
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `OPENROUTER_MODEL`: Model to use (default: `google/gemini-2.5-flash`)

The Vite config maps these to process.env variables for runtime access.

## Architecture

### Core Flow

1. **Document Upload** → User uploads financial document (FileUpload component)
2. **Configuration** → Loan details (amount, purpose, period) and lender parameters (DTI ratio, confidence threshold) are set
3. **AI Analysis** → Document + context sent to Gemini API via `geminiService.ts`
4. **Structured Output** → Gemini returns JSON with recommendation, risk factors, affordability metrics, and fraud flags
5. **Visualization** → Results displayed through multiple views (report, decision flow, risk radar, decision letter)

### State Management

App.tsx manages all application state:
- `fileData`: Base64-encoded document with MIME type
- `loanDetails`: Loan purpose, amount, repayment period
- `lenderConfig`: Risk thresholds (maxDtiRatio, minConfidence, strictEmploymentCheck) and organization details
- `history`: Array of all assessment reports (AssessmentReport[])
- `activeReportId`: Currently selected report for viewing

### Key Components

- **AnalysisReport**: Main report view showing recommendation, risk factors, affordability breakdown
- **DecisionFlow**: ReactFlow-based visual representation of the AI decision pipeline
- **RiskRadar**: Multi-dimensional risk visualization (document integrity, employer verification, affordability, income stability)
- **DecisionLetter**: Generates formal compliance letter using Gemini Flash model
- **Settings**: Full lender configuration management

### OpenRouter/Gemini Integration

Located in `services/geminiService.ts`:

- **API Provider**: OpenRouter (provides unified access to multiple AI models including Gemini)
- **Model Used**: Configurable via `OPENROUTER_MODEL` env var (default: `google/gemini-2.5-flash`). Letter generation uses `google/gemini-2.5-flash`
- **API Endpoint**: `https://openrouter.ai/api/v1/chat/completions` (OpenAI-compatible format)
- **Structured Output**: Uses OpenRouter's `response_format` with JSON Schema to enforce strict JSON structure matching TypeScript types
- **Context Parameters**: Lender config values (DTI threshold, confidence minimum, employment check strictness) are injected into the prompt
- **Multi-Modal Input**: Combines text prompt with base64-encoded document formatted as data URI (`data:image/[type];base64,[data]`)

### Type System

All types defined in `types.ts`:
- **Recommendation**: APPROVE | DECLINE | CONDITIONAL
- **RiskLevel**: LOW | MODERATE | HIGH
- **AssessmentReport**: Complete analysis output with affordability data, fraud flags, risk metrics, payment plans
- **LenderConfig**: Configurable risk parameters and organization details

### Styling Approach

Custom glass-morphism design with Tailwind-like utility classes:
- Dark theme (#0d0f1a base)
- Glass cards with `glass-card` class (backdrop blur, semi-transparent backgrounds)
- Heavy use of border gradients and shadows
- Font Awesome icons throughout
- Custom range sliders and animations
