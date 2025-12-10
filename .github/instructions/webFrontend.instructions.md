---
applyTo: 'web-frontend/**'
---


# Web Frontend Instructions

- Runb commands only after navigating to the `web-frontend` directory:
  ```bash
  cd web-frontend
  ```
- Use tRPC to communicate with the backend.
- Use Tailwind CSS for styling.
- Follow the existing component structure and naming conventions.
- Prioritize performance and accessibility in your implementations.
- Ensure responsiveness across different device sizes.
- Write clean, maintainable code without comments, but with clear naming and documentation.
- web-frontend docs should be used as reference for existing components and styles. Create/Update the docs as needed, keeping it simple and concise. use the docs/folder for that and ask to modify or implement it after the code changes if needed.
- Ensure compatibility with major browsers.
- run `tsc --noEmit` to check for type errors before finishing any piece of code. Don't include anything else when running this command (run it exactly as is), unless the context isn't in the web-frontend folder. Don't include `npx` at the beginning of the command.