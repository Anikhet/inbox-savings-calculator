# Inbox Cost Savings Calculator

A modern web application for calculating email infrastructure cost savings with exclusive reseller agreements.

## Features

- **Current Costs Input**: Enter your existing email sequencer costs, daily volume, domains, and total monthly expenses
- **Our Offer Configuration**: Set up your custom pricing for email sequencers and domain infrastructure
- **Flexible Domain Options**: Choose to use existing domains or purchase new ones
- **Real-time Calculations**: See immediate savings breakdown with monthly and annual projections
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Modern React patterns** with hooks and functional components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd conrad-calc
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Current Costs**: Fill in your existing email infrastructure costs including sequencer, volume, domains, and total monthly expenses
2. **Configure Our Offer**: Set your custom pricing for email sequencers and domain infrastructure
3. **Choose Domain Strategy**: Optionally use existing domains to reduce costs further
4. **Calculate Savings**: Click the calculate button to see your potential savings
5. **Review Results**: View detailed breakdown of monthly and annual savings

## Calculation Logic

The calculator follows the logic from the Google Sheets template:

- **Current Costs**: Sequencer + Domains + Total Monthly Infrastructure
- **Our Infrastructure**: Custom sequencer pricing + Domain costs (500 emails per domain)
- **Savings**: Difference between current and our costs
- **Annual Projections**: Monthly savings × 12 months

## Customization

### Pricing Constants
Edit `utils/calculator.ts` to modify:
- `DOMAIN_COST_PER_MONTH`: Default domain cost ($11.99)
- `EMAILS_PER_DOMAIN`: Infrastructure capacity (500 emails/domain)
- `MONTHS_PER_YEAR`: For annual calculations (12)

### Styling
Modify `tailwind.config.js` and `app/globals.css` to customize the visual design.

## Development

### Project Structure
```
conrad-calc/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   └── InboxCalculator.tsx # Main calculator component
├── types/                 # TypeScript type definitions
│   └── calculator.ts      # Calculator interfaces
├── utils/                 # Utility functions
│   ├── calculator.ts      # Calculation logic
│   └── validation.ts      # Form validation schemas
└── package.json           # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Include form validation for user inputs
4. Test calculations with various scenarios
5. Ensure responsive design works on all devices

## License

This project is proprietary and confidential. 