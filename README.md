<p align="center">
  <img src="https://raw.githubusercontent.com/devbaraus/proffy_server/master/purple-logo.svg" alt="Purple Proffy Logo" width="386px" />
</p>

<p align="center">	
   
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/devbaraus/proffy_server?color=#8257E5">

  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/devbaraus/proffy_server?color=#8257E5">

  <img alt="Stargazers" src="https://img.shields.io/github/stars/devbaraus/proffy_server?logo=github">

  <img src="https://api.netlify.com/api/v1/badges/30d7053b-7ee0-4950-b391-ae6799efea2d/deploy-status" title="Proffy Netlify Status">
  
</p>

---

> :rocket: Project made to connect students to teacher

## Table of contents

- [What is it](#what-is-it)
- [Technologies](#technologies)
- [Features](#features)
- [How to run](#how-to-run)
- [Ambient Variables](#ambient-variables)
  - [What are ambient variables](#what-are-ambient-variables)

# What is it

That's project was idealized by [Rocketseat](https://www.rocketseat.com.br) to a marathon called `Next Level Week #2` where they teach, another devs and people that are getting into programming, how to use a stack of development (React JS, React Native and NodeJS).

The idea behind Proffy is to connect people that want to study to people that want to give classes, storing connections.

# Technologies

- TypeScript
- NodeJS
- Knex
- Heroku
- PostgreSQL
- Mailer
- Cloudinary
- JWT
- [Front End](https://github.com/devbaraus/proffy_web) (Another repo)

# Features

- Authentication
- Give many classes as you want
- Each class has it's schedule
- User profile
- Avatar upload
- CRUD classes

# How to run

> If you want you can just live test on: [proffy.baraus.dev](https://proffy.baraus.dev)

- Clone the repository `https://github.com/devbaraus/proffy_server`
- Get in the folder `cd proffy_server`
- Install dependencies `yarn install`
- Run migrations `yarn knex:migrate`
- Run seed`yarn knex:seed` (if your want initial data and don't use if you already have stored data) 
- Set ambient variables [Ambient Variables](#ambient-variables)
- Execute script `yarn start`

# Ambient Variables

## What are ambient variables

Ambient variables are variables that are stored in your machine and can be read by applications, it is useful to store secret data, like and API token, and don't want to share your data with other.

For security I used ambient variables so I could share this repository with you!

The ambient variables I used were:

> CLOUDINARY - store images online

- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_NAME
- CLOUDINARY_URL

> DATABASE - store user infos

- DATABASE_URL

> MAILER - send email

- MAILER_HOST
- MAILER_PASSWORD
- MAILER_USER

> SECRET - used to generate token

- SECRET
