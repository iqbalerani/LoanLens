# LoanLens

AI-powered loan underwriting application that analyzes financial documents and provides intelligent loan recommendations using Google's Gemini AI.

## Features

- **Multi-Modal AI Analysis** - Upload financial documents (pay stubs, bank statements, tax returns) for AI-powered assessment
- **Configurable Risk Parameters** - Set custom DTI ratios, confidence thresholds, and employment verification requirements
- **Visual Decision Flows** - Interactive flow diagrams showing the AI's decision-making process
- **Risk Radar Visualization** - Multi-dimensional risk assessment across document integrity, employer verification, affordability, and income stability
- **Compliance Letters** - AI-generated formal decision letters for regulatory compliance
- **Assessment History** - Track and compare multiple loan assessments

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Provider**: OpenRouter (Google Gemini 2.5 Flash)
- **Visualization**: ReactFlow, Recharts
- **Styling**: Custom glass-morphism design with Tailwind-like utilities
- **Icons**: Font Awesome

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- OpenRouter API key ([sign up at openrouter.ai](https://openrouter.ai))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/LoanLens.git
   cd LoanLens
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the project root:

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How It Works

1. **Upload Document** - Submit financial documentation (PDF, PNG, JPG)
2. **Configure Parameters** - Set loan details and lender risk thresholds
3. **AI Analysis** - Gemini AI analyzes the document using structured output
4. **Review Results** - View recommendation, risk factors, affordability metrics, and fraud flags
5. **Generate Letter** - Create formal compliance decision letter

## Architecture

The application uses a structured AI pipeline:

- Document encoding and multi-modal prompting
- JSON Schema-enforced structured output from Gemini
- Real-time risk scoring across multiple dimensions
- Configurable lender parameters injected into AI context
