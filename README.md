### Packages
- axios - handle API requests
- bcryptjs - hashes passwords securely
- cors - enables cross-origin requests
- dotenv - loads environment variables
- express - web framework for API
- jsonwebtoken - handles authentication
- nodemon - auto-restarts backend on file changes
- react-router-dom - frontend routing
- socket.io - real-time bids

---
### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)
- PostgreSQL (with **pgAdmin 4** running)
> **Note**: Ensure your PostgreSQL server is running and accessible via pgAdmin 4.  
> Update your database credentials in the server's `.env` file if needed.
---

### Installation

From the root of the project, install dependencies:

```bash
npm install
```
---
1. Start the backend server:
```bash
npm run dev
```
2. Start the frontend server:
```bash
npm start
```
3. Once both are running, open your browser and go to
[http://localhost:3000](http://localhost:3000)
---
The page will reload when you make changes.\
You may also see any lint errors in the console.
