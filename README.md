## Library Management System 📚

A web app for managing all the activities of a library like managing members and book transactions, built on MERN Stack
![1](https://user-images.githubusercontent.com/73348574/205624307-6a1b18fa-5ef7-4de9-b141-9225eca62c6c.png)

### Video Demo

[Demo Link](https://drive.google.com/file/d/1gddUdOE41WaEyY4OWoJtDa0l6VJZTg94/view?usp=sharing)

Show some ❤️ and 🌟 the repo to support the project

## Index ✏️

- [Library Management System 📚](#library-management-system-)
  - [Video Demo](#video-demo)
- [Index ✏️](#index-️)
- [Features Of LCMS 🚀](#features-of-lcms-)
- [Setup 🔥](#setup-)
  - [Frontend Setup 🍧](#frontend-setup-)
  - [Backend Setup 🍿](#backend-setup-)
- [Technologies 🛠](#technologies-)
- [Screenshots](#screenshots)
- [References 💻](#references-)
- [Author 📝](#author-)
- [Connect Me On 🌍](#connect-me-on-)
- [License 🏆](#license-)

## Features Of LCMS 🚀

- Admin Login and Student Login
- Admin and Student Dashboard
- Adding Library Members
- Adding Books with Available Copies
- Issue and Return Transaction tracking of a Book by the Member
- Reserving a book for specific dates
- Showing the Achievements, Event Gallery

## Setup 🔥

- Fork the Repo

- Clone the repo to your local machine
  `git clone <repo-url>`

### Frontend Setup 🍧

1. Get into the frontend directory
   `cd frontend`

2. Run `npm install` to install dependencies

3. Create a `.env` file and create variables as mentioned in the `.env.example` with the values

4. Run `npm start` to start the application

### Backend Setup 🍿

1. Get into backend directory `cd backend`

2. Run `npm install` to install dependencies

3. Create a MongoDB account and get the `MONGO_URL` for connecting the server and the database

4. Create a `.env` file and create variables as mentioned in the `.env.example` with the values

5. Run `npm run dev` to start the server in development or `npm start` for production

### Local Configuration

- Backend: `PORT=5000`, `MONGO_URL=mongodb://127.0.0.1:27017/library-management-2`
- Frontend: `REACT_APP_API_URL=http://localhost:5000/`
- If you are building the frontend on Node 22+, the repo already includes the OpenSSL compatibility flag in the build and start scripts

### Demo Credentials

- Admin: `EMP1001` / `Admin@123`
- Student 1: `STU1001` / `Student@123`
- Student 2: `STU1002` / `Student@123`
- Run `npm run seed:demo` inside `backend` to load the sample users, books, categories, and transactions

### Deployment

- See [DEPLOYMENT.md](DEPLOYMENT.md) for the recommended Render setup for backend and frontend hosting

## Technologies 🛠

- ReactJS[Hooks]
- NodeJs
- ExpressJs
- MongoDB

## Screenshots

![1](https://user-images.githubusercontent.com/73348574/205623377-999c0de5-6796-4100-85e6-96e3e7d4fb77.png)
![2](https://user-images.githubusercontent.com/73348574/205632416-bfcc2c19-3f70-4688-bb7e-0ccd83be3038.png)
![3](https://user-images.githubusercontent.com/73348574/205632598-6b009820-20ec-4e9f-92bf-00af92d4f1a4.png)
![4](https://user-images.githubusercontent.com/73348574/205632198-d99fcc8d-903d-4b60-9cec-56f8e0716290.png)
![5](https://user-images.githubusercontent.com/73348574/205631397-2793e97e-3cc6-4b60-8ee1-ec81716b9d6d.png)
![6](https://user-images.githubusercontent.com/73348574/205631670-5dcb6437-afb1-4aaf-87d7-b47c3b01d7b1.png)
![7](https://user-images.githubusercontent.com/73348574/205631804-6c631b5e-8bcd-41c4-bb73-bab6ea8b78f7.png)
![8](https://user-images.githubusercontent.com/73348574/205631977-f393ca09-aa24-42a5-9bd7-d92d471c514c.png)

## References 💻

- [NodeJs Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Author 📝

- [@iampranavdhar](https://www.github.com/iampranavdhar)

## Connect Me On 🌍

[![twitter badge](https://img.shields.io/badge/twitter-Pranavdhar-0077b5?style=social&logo=twitter)](https://twitter.com/iampranavdhar)<br/>
[![linkedin badge](https://img.shields.io/badge/linkedin-Pranavdhar-0077b5?style=social&logo=linkedin)](https://in.linkedin.com/in/sai-pranavdhar-reddy-nalamalapu-038104206)

## License 🏆

This repository is licensed under MIT License. Find [LICENSE](LICENSE) to know more
