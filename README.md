## GENERAL PROJECT SETUP

    1. Install tools: Download and install VSCode and Git.

    2. Prepare folder: Create a project folder and open it in VSCode.

    3. Configure Git: Set your username and email.

    4. Clone repository: Copy repo URL and run `git clone https://github.com/Noname01010101/ai-store.git`.

    5. Install dependencies: open the specific service you will develop on and run `npm install`.

    6. Branch workflow: Create a new branch before making changes `git checkout -b feature/<short-description-of-feature>`. -> The short description should indicate what you're working on (e.g. creating a new microservice)

    7. install Docker Desktop (Docker commands only work if docker desktop is running)




## API DEVELOPMENT INSTRUCTIONS

    7. Download the latest version of node on your local machine
    8. start the database with `docker-compose up <name-of-the-db> --build` (This command must be ran inside the root project context)
    9. move what's in .env.dev to .env for development purposes.
    10. run `npx prisma generate` & `npx prisma db push` & `npm run seed`

    * `npm run dev` -> runs the project, which connects to the running database and starts the server
