
# 22POULTRY - Poultry Management Platform

Welcome to 22POULTRY, a comprehensive platform for the poultry industry. This application connects farmers, suppliers, trainers, and financial institutions in a single platform to streamline poultry management and business operations.

## Features

- **User Authentication**: Secure login and signup functionality
- **User Profiles**: Customizable profiles with avatar uploads
- **Dashboard**: Overview of key metrics and statistics
- **Marketplace**: Buy and sell poultry products
- **Training Resources**: Access to poultry management training
- **Financial Services**: Connect with financial institutions offering farm loans
- **Networking**: Connect with other industry professionals
- **News Feed**: Stay updated with industry news and events

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **State Management**: React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: GitHub Actions, Supabase

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/22poultry.git
   cd 22poultry
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server
   ```
   npm run dev
   ```

### Database Setup

The application uses Supabase for database and authentication. The schema will be automatically set up when you run the migrations:

```
npx supabase db push
```

## Testing

Run the tests using:

```
npm test
```

## Deployment

The application is set up for CI/CD with GitHub Actions. Every push to the main branch triggers a deployment to Supabase.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/your-username/22poultry](https://github.com/your-username/22poultry)
